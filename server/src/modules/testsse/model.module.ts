import { Module } from '@nestjs/common';
import ModelService from './model.service';
import ModelController from './model.controller';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import ModelSchema from './schema/model.schema';

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
export default class ModelModule {}
