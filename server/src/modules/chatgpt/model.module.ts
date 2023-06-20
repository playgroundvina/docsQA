import { Module } from '@nestjs/common';
import ModelService from './model.service';
import UploadService from 'src/modules/upload/model.service';
import UploadModule from 'src/modules/upload/model.module';
import ModelController from './model.controller';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import ModelSchema from './schema/model.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    // HttpModule,
    UploadModule,
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
