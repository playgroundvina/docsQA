import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import ModelService from './model.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { IHttpSuccess, AppResponse } from 'src/shared/services/response-status';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import Constants from './constants';
import { Types } from 'mongoose';

@ApiTags(Constants.tag)
@Controller({ path: Constants.path })
class ModelController {
  constructor(private readonly modelService: ModelService) { }

  @Get(Constants.endpoint.FIND_ALL_BY_FILE)
  @ApiOperation({ summary: `-- Get ALL ${ModelSchema.name}s by id file` })
  public async findByOwner(
    @Param('id') id: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IHttpSuccess | HttpException> {

    const records = await this.modelService.findAllIdFile(id, page, limit);
    const total = await this.modelService.getTotalRowByKeyObject('id_file', id);

    const paginationInfo = {
      total,
    };
    console.log(id);

    if (total == 0) {
      return AppResponse.success(HTTP_STATUS.NO_FOUND, ModelSchema.name);
    }

    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, [
      [...records.reverse()],
      paginationInfo,
    ]);
  }

  @Post(Constants.endpoint.CHAT)
  @ApiOperation({ summary: `-- chat with ${ModelSchema.name}` })
  public async chat(
    @Param('id') id: string,
    @Body() body: CreateModelDto,
  ): Promise<IHttpSuccess | HttpException> {
    const result = await this.modelService.chat(id, body.content)
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, result);
  }

  @Delete()
  @ApiOperation({ summary: `-- delete all${ModelSchema.name}` })
  public async removeAll(
  ): Promise<IHttpSuccess | HttpException> {
    const result = await this.modelService.removeAll()
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name);
  }

  @Delete(Constants.endpoint.REMOVE)
  @ApiOperation({ summary: `-- delete ${ModelSchema.name}s in file ` })
  public async deleteByFile(@Param('id') id: string
  ): Promise<IHttpSuccess | HttpException> {
    const result = await this.modelService.deleteByFile(id)
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name);
  }


}
export default ModelController;
