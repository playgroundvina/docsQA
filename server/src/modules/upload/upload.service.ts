import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import * as fs from 'fs';
import constants from './constants';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
class ModelService extends BaseService<ModelSchema> {
  constructor(
    @InjectModel(ModelSchema.name)
    protected readonly _baseModel: Model<ModelSchema>,
  ) {
    super(_baseModel);
  }

  public async upload(file: Express.Multer.File, path: string, filename: string, fileNameNotExtension?: string): Promise<any> {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    const result = await fs.promises.writeFile(`${path}/${filename}`, file.buffer);


    const loader = new PDFLoader(`${path}/${filename}`, {
      // you may need to add `.then(m => m.default)` to the end of the import
      pdfjs: () => import("pdfjs-dist/legacy/build/pdf.js"),
      splitPages: false,
    });
    const text = (await loader.load())

    const result2 = await fs.promises.writeFile(`${path}/${fileNameNotExtension}.txt`, text[0].pageContent);

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
    await this.upload(file, path, filehash, fileNameNotExtension)
    const data = {
      owner: CreateModelDto.owner,
      filename: filename,
      url: `${CreateModelDto.owner}/${filehash}`,
      urlData: `${CreateModelDto.owner}/${fileNameNotExtension}.txt`
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




}
export default ModelService;



