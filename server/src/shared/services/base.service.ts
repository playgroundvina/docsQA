import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class BaseService<T> {
  protected _objectId = mongoose.Types.ObjectId;

  constructor(@InjectModel('Schema') protected readonly _baseModel: Model<T>) { }

  public async getTotalRow(): Promise<number> {
    return this._baseModel.countDocuments();
  }

  public async getTotalRowByKey(key: string, value: any): Promise<number> {
    const conditions: Record<string, unknown> = {};
    conditions[key] = value;
    return this._baseModel.countDocuments(conditions);
  }

  public async getTotalRowByKeyObject(key: string, value: any): Promise<number> {
    const conditions: Record<string, unknown> = {};
    conditions[key] = new this._objectId(value);
    return this._baseModel.countDocuments(conditions);
  }

  public async findOneById(id: string): Promise<T | null> {
    const getID = this._getID(id);
    if (getID) {
      const record = await this._baseModel.findById(getID).exec();
      return record;
    }
    return null;
  }

  protected _getID(id: string): mongoose.Types.ObjectId | null {
    const objectId = mongoose.Types.ObjectId;
    try {
      const newID = new objectId(id) ?? null;
      return newID;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  public async removeById(id: string): Promise<T | null> {
    const getID = this._getID(id);
    if (getID) {
      const result = await this._baseModel.findByIdAndRemove(getID).exec();
      return result;
    }
    return null;
  }

  public async removeAll(): Promise<T | null> {
    const result = await this._baseModel.deleteMany();
    return null;
  }
}
