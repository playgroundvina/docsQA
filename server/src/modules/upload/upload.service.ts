import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/upload.schema';
import * as fs from 'fs';
import constants from './constants';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from "langchain/vectorstores/chroma";
@Injectable()
class ModelService extends BaseService<ModelSchema> {
  constructor(
    @InjectModel(ModelSchema.name)
    protected readonly _baseModel: Model<ModelSchema>,
  ) {
    super(_baseModel);
  }

  public async upload(file: Express.Multer.File, path: string, filename: string, fileNameNotExtension?: string, id_owner?: string): Promise<any> {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    const result = await fs.promises.writeFile(`${path}/${filename}`, file.buffer);

    // Create docs with a loader
    const loader = new PDFLoader(`${path}/${filename}`, {
      // you may need to add `.then(m => m.default)` to the end of the import
      pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
      splitPages: false,
    });
    const text = (await loader.load())
    // Create vector store and index the docs
    /* Split the text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const docs = await textSplitter.createDocuments([text[0].pageContent]);

    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    // const apiKey = `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`
    const apiKey = `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`

    let vectorStore
    try {
      vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: apiKey }));
    } catch (error) {
      console.log(error);

    }
    const directory = `./modelai/${id_owner}/${fileNameNotExtension}`;
    if (vectorStore) {
      await vectorStore.save(directory);
    }
    // const result2 = await fs.promises.writeFile(`${path}/${fileNameNotExtension}.txt`, text[0].pageContent);

  }

  convertToValidFileName(input: string): string {
    // Loại bỏ các ký tự không phù hợp với tên tập tin
    const invalidCharactersRegex = /[^\w\d_\-.]+/g;
    const validInput = input.replace(invalidCharactersRegex, '');

    // Giới hạn độ dài của tên tập tin tối đa là 255 ký tự
    const maxLength = 255;
    const truncatedInput = validInput.substring(0, maxLength);

    return truncatedInput;
  }

  public async create(file: Express.Multer.File, CreateModelDto: CreateModelDto): Promise<ModelSchema | null> {


    const path = `./uploads/${CreateModelDto.owner}`
    const filename = CreateModelDto.filename || file.originalname
    const filehash = this.convertToValidFileName(filename)
    const fileNameNotExtension = filehash.split(".").shift();
    if (fs.existsSync(`${path}/${filehash}`)) {
      return null;
    }
    await this.upload(file, path, filehash, fileNameNotExtension, CreateModelDto.owner)
    const data = {
      owner: CreateModelDto.owner,
      filename: filename,
      url: `${CreateModelDto.owner}/${filehash}`,
      urlModelAi: `${CreateModelDto.owner}/${fileNameNotExtension}`
    }
    const result = await this._baseModel.create(data);
    return result;
  }

  public async findByOwner(id: string, page: number, limit: number): Promise<ModelSchema[]> {
    const skipIndex = (page - 1) * limit;
    const records = await this._baseModel
      .find({ owner: id })
      .select('url filename')
      .sort({ 'createdAt': -1 })
      .limit(limit)
      .skip(skipIndex)
    return records;
  }

  public async removeOneFile(id: string): Promise<void> {
    const records = await this.findOneById(id);
    if (records) {
      await this.deleteFile(`./uploads/${records?.url}`)
      await this.deleteDir(`./modelai/${records?.urlModelAi}`)
      await this.removeById(id)
    }
  }

  public async deleteFile(url: string) {
    fs.unlink(url, (err) => {
      if (err) throw err;
    });
  }

  public async deleteDir(url: string) {
    fs.rmdir(url, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }






}
export default ModelService;



