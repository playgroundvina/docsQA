import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import constants from './constants';
import { HttpService } from '@nestjs/axios';
import UploadService from 'src/modules/upload/model.service';
import { HumanChatMessage, AIChatMessage } from "langchain/schema";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain, StuffDocumentsChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import * as fs from "fs";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { BasePromptTemplate, BasePromptTemplateInput, ChatPromptTemplate, ConditionalPromptSelector, PromptTemplate, SystemMessagePromptTemplate, isChatModel } from "langchain/prompts";
@Injectable()
class ModelChatGptService extends BaseService<ModelSchema> {
  constructor(
    @InjectModel(ModelSchema.name)
    // private readonly httpService: HttpService,
    protected readonly _baseModel: Model<ModelSchema>,
    private readonly uploadService: UploadService
  ) {
    super(_baseModel);
  }

  public async findAllIdFile(id: string, page: number, limit: number): Promise<ModelSchema[]> {
    const skipIndex = (page - 1) * limit;
    const records = await this._baseModel
      .find({ id_file: new this._objectId(id) })
      .sort({ 'createdAt': -1 })
      .limit(limit)
      .skip(skipIndex)
    return records;
  }
  public async findOneByName(name: string): Promise<ModelSchema | null> {
    const record = await this._baseModel.findOne({ name: name }).exec();
    return record;
  }

  public async create(id: string, content: string, role = constants.role.HUMAN): Promise<ModelSchema> {
    const data = {
      id_file: new this._objectId(id),
      role: role,
      content: content,
    }
    const result = await this._baseModel.create(data);
    return result;
  }

  public async chat(id: string, content: string): Promise<any> {

    console.log(content);

    //lưu câu trả lời người dùng
    const resultHuman = await this.create(id, content);
    //lấu url file
    const fileurl = (await this.uploadService.findOneById(id))?.urlData
    //lấy lịch sử chat ra
    const historychat = (await this.findAllIdFile(id, 1, 10)).reverse();
    /* Initialize the LLM to use to answer the question */
    // return historychat
    // const apiKey = `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`
    // const apiKey = `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`
    const apiKey = `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`

    const model = new OpenAI({ openAIApiKey: apiKey, modelName: "gpt-3.5-turbo", temperature: 0 });

    /* Load in the file we want to do question answering over */
    const text = fs.readFileSync(`./uploads/${fileurl}`, "utf8");


    /* Split the text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const docs = await textSplitter.createDocuments([text]);
    /* Create the vectorstore */
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: apiKey }));
    //set pastMessages
    let pastMessages: (AIChatMessage | HumanChatMessage)[] = [];
    historychat.forEach(e => {
      if (e.role == constants.role.AI) {
        pastMessages.push(new AIChatMessage(e.content))
      }
      else if (e.role == constants.role.HUMAN) {
        pastMessages.push(new HumanChatMessage(e.content))
      }
    })
    const language_name = 'vietnamese'
    const template = `Please reply my question in ${language_name}. Please answer in detail, without missing word. {question}`;
    const promptA = new PromptTemplate({ template, inputVariables: ["question"] });

    // Chat history
    /* Create the chain */
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        qaChainOptions: {
          type: 'stuff',
          prompt: promptA,
        },
        memory: new BufferMemory({
          chatHistory: new ChatMessageHistory(pastMessages),
          memoryKey: "chat_history", // Must be set to "chat_history"
          returnMessages: true,
        }),
      },
    );

    /* Ask it a question */
    const res = await chain.call({
      question: { question: content }
    });
    console.log(res);

    // //lưu câu trả lời người dùng
    const resultAI = await this.create(id, res.text, constants.role.AI);

    return res

  }

  public async deleteByFile(id: string): Promise<void> {
    await this._baseModel.deleteMany({ id_file: new this._objectId(id) })
  }



}
export default ModelChatGptService;
