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

@ApiTags(Constants.tag)
@Controller({ path: Constants.path })
class ModelController {
  constructor(private readonly modelService: ModelService) {}
  @Post(Constants.endpoint.CREATE)
  @ApiOperation({ summary: `-- Create New ${ModelSchema.name}` })
  public async create(
    @Body() createRoleDto: CreateModelDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.modelService.findOneByName(createRoleDto.name);
    if (!user) {
      const result = await this.modelService.create(createRoleDto);
      return AppResponse.success(HTTP_STATUS.CREATED, ModelSchema.name, result);
    }
    return AppResponse.conflict(ModelSchema.name, `name`, createRoleDto.name);
  }

  @Get(Constants.endpoint.FIND_ALL)
  @ApiOperation({ summary: `-- Get All ${ModelSchema.name}s` })
  public async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IHttpSuccess> {
    const records = await this.modelService.findAll(page, limit);
    const total = await this.modelService.getTotalRow();
    const paginationInfo = {
      total,
    };
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, [
      [...records],
      paginationInfo,
    ]);
  }

  @Get(Constants.endpoint.FIND_BY_ID)
  @ApiOperation({ summary: `-- Get ${ModelSchema.name} By ID` })
  public async findOneById(
    @Param('id') id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const record = await this.modelService.findOneById(id);
    if (!record) {
      return AppResponse.notFound(ModelSchema.name, 'id', id);
    }
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, record);
  }

  @Patch(Constants.endpoint.UPDATE)
  @ApiOperation({ summary: `-- Update ${ModelSchema.name} By ID` })
  public async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateModelDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.modelService.findOneById(id);
    if (user) {
      const result = await this.modelService.update(id, updateRoleDto);
      return AppResponse.success(HTTP_STATUS.UPDATE, ModelSchema.name, result);
    }
    return AppResponse.notFound(ModelSchema.name, `id`, id);
  }

  @Delete(Constants.endpoint.REMOVE)
  @ApiOperation({ summary: `-- Delete ${ModelSchema.name} By ID` })
  public async remove(
    @Param('id') id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.modelService.findOneById(id);
    if (user) {
      const result = await this.modelService.removeById(id);
      return AppResponse.success(HTTP_STATUS.DELETE, ModelSchema.name, result);
    }
    return AppResponse.notFound(ModelSchema.name, `id`, id);
  }
}
export default ModelController;
