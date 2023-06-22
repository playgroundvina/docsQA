import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/schema/base.schema';

@Schema()
export default class Model extends BaseSchema {
  @Prop({
    type: String,
    default: 'name model example',
  })
  name: string;
  @Prop({
    type: Number,
    default: 'prop1 model have type number',
  })
  prop1: number;
}
