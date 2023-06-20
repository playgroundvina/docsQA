import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseSchema } from 'src/shared/schema/base.schema';
import { Role } from 'src/modules/role/schema/role.schema';
import { IConstantType } from 'src/shared/interfaces/schema-constant';

export type UserDocument = Document & User;

@Schema()
export class User extends BaseSchema {
  @Prop({
    type: Types.ObjectId,
    ref: Role.name,
  })
  role: IConstantType;

  @Prop({
    type: String,
  })
  username: string;

  @Prop({
    type: String,
  })
  fullName: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Number,
    required: true,
  })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
