import { Module } from '@nestjs/common';
import ModelService from './chatgpt.service';
import UploadService from 'src/modules/upload/upload.service';
import UploadModule from 'src/modules/upload/upload.module';
import ModelController from './chatgpt.controller';
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
