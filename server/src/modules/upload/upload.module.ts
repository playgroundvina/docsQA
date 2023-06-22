import { Module } from '@nestjs/common';
import ModelService from './upload.service';
import ModelController from './upload.controller';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import ModelSchema from './schema/upload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ModelSchema.name,
        schema: SchemaFactory.createForClass(ModelSchema),
      },
    ]),
  ],
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export default class ModelModule { }
