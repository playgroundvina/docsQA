import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'src/shared/services/base.service';
import { Role } from '../role/schema/role.schema';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.name) protected readonly _baseModel: Model<User>,
  ) {
    super(_baseModel);
  }

  public async findAll(page: number, limit: number): Promise<User[]> {
    const skipIndex = (page - 1) * limit;
    const records = await this._baseModel
      .find()
      .sort('-_id')
      .limit(limit)
      .skip(skipIndex)
      .populate(Role.name.toLowerCase(), { name: 1 })
      .exec();
    return records;
  }

  public async findOneById(id: string): Promise<User | null> {
    const getID = this._getID(id);
    if (getID) {
      const record = await this._baseModel
        .findById(getID)
        .select('-password')
        .populate(Role.name.toLowerCase(), { name: 1 })
        .exec();
      return record;
    }
    return null;
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    const record = await this._baseModel.findOne({ email: email }).exec();
    return record;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const result = await this._baseModel.create(createUserDto);
    return result;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const newId = new this._objectId(id);
    const result = await this._baseModel
      .findByIdAndUpdate(newId, updateUserDto, { new: true })
      .exec();
    return result;
  }
}
