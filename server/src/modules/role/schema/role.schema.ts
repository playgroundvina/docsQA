import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/shared/schema/base.schema';
import { APP_CONSTANT } from 'src/shared/constants/app.constant';

export type RoleDocument = Document & Role;

@Schema()
export class Role extends BaseSchema {
  @Prop({
    type: String,
    default: APP_CONSTANT.ROLES.user,
  })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
