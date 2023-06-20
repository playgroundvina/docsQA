import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Role } from './schema/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RoleService extends BaseService<Role> {
  constructor(
    @InjectModel(Role.name) protected readonly _baseModel: Model<Role>,
  ) {
    super(_baseModel);
  }

  public async findAll(page: number, limit: number): Promise<Role[]> {
    const skipIndex = (page - 1) * limit;
    const records = await this._baseModel
      .find()
      .sort('-_id')
      .limit(limit)
      .skip(skipIndex)
      .exec();
    return records;
  }

  public async findOneByName(name: string): Promise<Role | null> {
    const record = await this._baseModel.findOne({ name: name }).exec();
    return record;
  }

  public async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const result = await this._baseModel.create(createRoleDto);
    return result;
  }

  public async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role | null> {
    const newId = new this._objectId(id);
    const result = await this._baseModel
      .findByIdAndUpdate(newId, updateRoleDto, { new: true })
      .exec();
    return result;
  }
}
