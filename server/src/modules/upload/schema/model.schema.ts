import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber, IsString } from 'class-validator';
import { BaseSchema } from 'src/shared/schema/base.schema';

@Schema()
export default class File extends BaseSchema {
  @IsString()
  @Prop({
    type: String,
    required: true,
  })
  owner: string;

  @IsString()
  @Prop({
    type: String,
    required: true,
  })
  url: string;
  @IsString()
  @Prop({
    type: String,
    required: true,
  })
  urlData: string;

  @IsString()
  @Prop({
    type: String,
  })
  filename: string;
}
