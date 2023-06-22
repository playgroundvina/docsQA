import { diskStorage } from 'multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import ModelService from './upload.service';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { IHttpSuccess, AppResponse } from 'src/shared/services/response-status';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import Constants from './constants';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import path, { join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';
import CreateModelDto from 'src/modules/upload/dto/create.dto';

@ApiTags(Constants.tag)
@Controller({ path: Constants.path })
class ModelController {
  constructor(private readonly modelService: ModelService) { }

  // @Post(Constants.endpoint.CREATE)
  // @ApiOperation({ summary: `-- Create New ${ModelSchema.name}` })
  // public async create(@Body() createRoleDto: CreateModelDto,): Promise<IHttpSuccess | HttpException> {
  //   const user = await this.modelService.findOneByName(createRoleDto.name);
  //   if (!user) {
  //     const result = await this.modelService.create(createRoleDto);
  //     return AppResponse.success(HTTP_STATUS.CREATED, ModelSchema.name, result);
  //   }
  //   return AppResponse.conflict(ModelSchema.name, `name`, createRoleDto.name);
  // }
  @UseInterceptors(FileInterceptor('file'))
  @Post(Constants.endpoint.CREATE)
  @ApiOperation({ summary: `-- upload ${ModelSchema.name}s ` })
  @ApiConsumes('multipart/form-data')
  public async uploadFile(
    @Body() body: CreateModelDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IHttpSuccess | HttpException> {

    const result = await this.modelService.create(file, body)
    if (!result) {
      return AppResponse.conflict(ModelSchema.name)
    }
    return AppResponse.success(HTTP_STATUS.CREATED, ModelSchema.name, result);
  }

  @Get(Constants.endpoint.FIND_BY_OWNER)
  @ApiOperation({ summary: `-- Get ALL ${ModelSchema.name}s by user` })
  public async findByOwner(
    @Param('id') idOwner: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IHttpSuccess | HttpException> {

    const records = await this.modelService.findByOwner(idOwner, page, limit);
    const total = await this.modelService.getTotalRowByKey('owner', idOwner);
    const paginationInfo = {
      total,
    };

    if (total == 0) {
      return AppResponse.success(HTTP_STATUS.NO_FOUND, ModelSchema.name);
    }

    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, [
      [...records],
      paginationInfo,
    ]);
  }

  @Get(Constants.endpoint.FIND_BY_FILE)
  @ApiOperation({ summary: `-- Get ${ModelSchema.name}s` })
  public async getFile(@Param('id') id: string, @Param('filename') filename: string, @Res() res: Response): Promise<any> {
    const file = join(
      process.cwd(),
      `uploads/${id}/${filename}`,
    );
    res.sendFile(file);
  }

  @Delete()
  @ApiOperation({ summary: `-- delete all${ModelSchema.name}` })
  public async removeAll(
  ): Promise<IHttpSuccess | HttpException> {
    const result = await this.modelService.removeAll()
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name);
  }
}
export default ModelController;
