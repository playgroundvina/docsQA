import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';

@Injectable()
class ModelService extends BaseService<ModelSchema> {
  constructor(
    @InjectModel(ModelSchema.name)
    protected readonly _baseModel: Model<ModelSchema>,
  ) {
    super(_baseModel);
  }

  public async findAll(page: number, limit: number): Promise<ModelSchema[]> {
    const skipIndex = (page - 1) * limit;
    const records = await this._baseModel
      .find()
      .sort('-_id')
      .limit(limit)
      .skip(skipIndex)
      .exec();
    return records;
  }

  public async findOneByName(name: string): Promise<ModelSchema | null> {
    const record = await this._baseModel.findOne({ name: name }).exec();
    return record;
  }

  public async create(CreateModelDto: CreateModelDto): Promise<ModelSchema> {
    const result = await this._baseModel.create(CreateModelDto);
    return result;
  }

  public async update(
    id: string,
    UpdateModelDto: UpdateModelDto,
  ): Promise<ModelSchema | null> {
    const newId = new this._objectId(id);
    const result = await this._baseModel
      .findByIdAndUpdate(newId, UpdateModelDto, { new: true })
      .exec();
    return result;
  }
}
export default ModelService;
