import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import File from 'src/modules/upload/schema/model.schema';
import { IConstantType } from 'src/shared/interfaces/schema-constant';
import { BaseSchema } from 'src/shared/schema/base.schema';
export type UserDocument = Document & chatgpt;

@Schema()
export default class chatgpt extends BaseSchema {
  @Prop({
    type: Types.ObjectId,
    ref: File.name,
  })
  id_file: File;

  @Prop({
    type: String
  })
  content: string
  @Prop({
    type: String
  })
  role: string
}
