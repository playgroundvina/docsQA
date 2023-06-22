import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import constants from './constants';
import { HttpService } from '@nestjs/axios';
import UploadService from 'src/modules/upload/upload.service';
import { HumanChatMessage, AIChatMessage } from "langchain/schema";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain, RetrievalQAChain, StuffDocumentsChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import * as fs from "fs";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { interval, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BasePromptTemplate, BasePromptTemplateInput, ChatPromptTemplate, ConditionalPromptSelector, PromptTemplate, SystemMessagePromptTemplate, isChatModel } from "langchain/prompts";
import { Response } from 'express';

@Injectable()
class ModelChatGptService extends BaseService<ModelSchema> {
  private token$: Subject<string> = new Subject();
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

  public async chat(id: string, createModelDto: CreateModelDto): Promise<any> {


    //lấy lịch sử chat ra
    const historychat = (await this.findAllIdFile(id, 1, 2)).reverse();

    //lưu câu trả lời người dùng
    const resultHuman = await this.create(id, createModelDto.content);

    //lấu url file
    const file = await this.uploadService.findOneById(id)
    const directory = `./modelai/${file?.urlModelAi}`
    /* Initialize the LLM to use to answer the question */
    // return historychat
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    const apiKey = `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`

    let streamedResponse = "";
    const model = new OpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
          },
        },
      ],
    });

    // Load the vector store from the same directory
    const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings({ openAIApiKey: apiKey }));
    let pastMessages: string = ``
    const prompt = `Please reply my question in ${createModelDto.language || 'vietnamese'}. Please answer in detail, without missing word`;

    if (historychat.length > 1) {
      pastMessages += `Here is the conversation history:\n`
      historychat.forEach(e => {
        pastMessages += (`${e.role == constants.role.AI ? 'Assistant' : 'User'} : ${e.content}.\n`)
      })
      pastMessages += `Based on the above conversation, let's start our conversation. You need to answer : "${createModelDto.content}".\n${prompt}.\n`
    }

    else {
      pastMessages += (`${createModelDto.content}. ${prompt}.\n`)
    }



    console.log(pastMessages);

    // Chat history
    /* Create the chain */
    const chain = RetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
    );



    // /* Ask it a question */
    const res = await chain.call({
      query: pastMessages
    });

    console.log(res);

    // //lưu câu trả lời người dùng
    const resultAI = await this.create(id, res.text, constants.role.AI);

    return res

  }


  public async chatStream(id: string, createModelDto: CreateModelDto, response: Response): Promise<any> {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      // Important to set no-transform to avoid compression, which will delay
      // writing response chunks to the client.
      // See https://github.com/vercel/next.js/issues/9965
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    const sendData = (data: string) => {
      response.write(`data: ${data.replace('\n', '*%#')}\n\n`);


    };


    //lấy lịch sử chat ra
    const historychat = (await this.findAllIdFile(id, 1, 4)).reverse();

    //lưu câu trả lời người dùng
    const resultHuman = await this.create(id, createModelDto.content);

    //lấu url file
    const file = await this.uploadService.findOneById(id)
    const directory = `./modelai/${file?.urlModelAi}`
    /* Initialize the LLM to use to answer the question */
    // return historychat
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    const apiKey = `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`

    let streamedResponse = "";
    const model = new OpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            sendData(token);
          },

        },
      ],
    });

    // Load the vector store from the same directory
    const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings({ openAIApiKey: apiKey }));
    let pastMessages: string = ``
    const prompt = `Please reply my question in ${createModelDto.language || 'vietnamese'}. Please answer in detail, without missing word`;

    if (historychat.length > 1) {
      pastMessages += `Here is the conversation history:\n`
      historychat.forEach(e => {
        pastMessages += (`${e.role == constants.role.AI ? 'Assistant' : 'User'} : ${e.content}.\n`)
      })
      pastMessages += `Based on the above conversation, let's start our conversation. You need to answer : "${createModelDto.content}".\n${prompt}.\n`
    }

    else {
      pastMessages += (`${createModelDto.content}. ${prompt}.\n`)
    }



    console.log(pastMessages);

    // Chat history
    /* Create the chain */
    const chain = RetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
    );



    try {
      // /* Ask it a question */
      const res = await chain.call({
        query: `${createModelDto.content}. ${prompt}.\n`
      });

      console.log(res);

      // //lưu câu trả lời người dùng
      const resultAI = await this.create(id, res.text, constants.role.AI);

      return res
    } catch (err) {
      console.error(err);
      // Ignore error
    } finally {
      sendData("[DONE]");
      response.end();
    }

  }


  public async chatStreamV2(id: string, createModelDto: CreateModelDto, response: Response): Promise<any> {
    response.writeHead(200, {
      "Content-Type": "text/event-stream",
      // Important to set no-transform to avoid compression, which will delay
      // writing response chunks to the client.
      // See https://github.com/vercel/next.js/issues/9965
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    });

    const sendData = (data: string) => {
      response.write(`data: ${data.replace('\n', '*%#')}\n\n`);


    };


    //lấy lịch sử chat ra
    const historychat = (await this.findAllIdFile(id, 1, 6)).reverse();

    //lưu câu trả lời người dùng
    const resultHuman = await this.create(id, createModelDto.content);

    //lấu url file
    const file = await this.uploadService.findOneById(id)

    const directory = `./modelai/${file?.urlModelAi}`
    /* Initialize the LLM to use to answer the question */
    // return historychat
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    const apiKey = `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`

    let streamedResponse = "";
    const model = new OpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      streaming: true,
      callbacks: [
        {
          handleLLMNewToken(token) {
            sendData(token);
          },

        },
      ],
    });

    // Load the vector store from the same directory
    const vectorStore = await HNSWLib.load(directory, new OpenAIEmbeddings({ openAIApiKey: apiKey }));

    let pastMessages: string = ``
    const prompt = `Please reply my question in ${createModelDto.language || 'vietnamese'}. Please answer in detail, without missing word`;

    if (historychat.length > 1) {
      pastMessages += `Here is the conversation history:\n`
      historychat.forEach(e => {
        pastMessages += (`${e.role == constants.role.AI ? 'Assistant' : 'User'} : ${e.content}.\n`)
      })
      pastMessages += `Based on the above conversation, let's start our conversation. You need to answer : "${createModelDto.content}".\n${prompt}.\n`
    }

    else {
      pastMessages += (`${createModelDto.content}. ${prompt}.\n`)
    }



    console.log(pastMessages);


    const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

    Chat History:
    {chat_history}
    Follow Up Input: {question}
    Standalone question:`;

    const QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
    If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

    {context}

    Question: {question}
    Helpful answer in markdown:`;

    // Chat history
    /* Create the chain */
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        qaTemplate: QA_PROMPT,
        questionGeneratorTemplate: CONDENSE_PROMPT,
        returnSourceDocuments: true, //The number of source documents returned is 4 by default
      },
    );



    try {
      // /* Ask it a question */
      const res = await chain.call({
        question: {

        }
      });

      console.log(res);

      // //lưu câu trả lời người dùng
      const resultAI = await this.create(id, res.text, constants.role.AI);

      return res
    } catch (err) {
      console.error(err);
      // Ignore error
    } finally {
      sendData("[DONE]");
      response.end();
    }

  }

  public async deleteByFile(id: string): Promise<void> {
    await this._baseModel.deleteMany({ id_file: new this._objectId(id) })
  }

}
export default ModelChatGptService;
