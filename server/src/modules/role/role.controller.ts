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
import { RoleService } from './role.service';
import { ROLE_API } from 'src/shared/constants/endpoint.constant';
import { APP_CONSTANT } from 'src/shared/constants/app.constant';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { IHttpSuccess, AppResponse } from 'src/shared/services/response-status';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { Role } from './schema/role.schema';

@ApiTags(APP_CONSTANT.TAGS.ROLE.title)
@Controller({ path: APP_CONSTANT.MODULE_API.role })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post(ROLE_API.CREATE)
  // @ApiResponse(HTTP_STATUS.CREATED)
  @ApiOperation({ summary: `-- Create New ${Role.name}` })
  public async create(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.roleService.findOneByName(createRoleDto.name);
    if (!user) {
      const result = await this.roleService.create(createRoleDto);
      return AppResponse.success(HTTP_STATUS.CREATED, Role.name, result);
    }
    return AppResponse.conflict(Role.name, `name`, createRoleDto.name);
  }

  @Get(ROLE_API.FIND_ALL)
  // @ApiResponse({ ...HTTP_STATUS.OK })
  @ApiOperation({ summary: `-- Get All ${Role.name}s` })
  public async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IHttpSuccess> {
    const records = await this.roleService.findAll(page, limit);
    const total = await this.roleService.getTotalRow();
    const paginationInfo = {
      total,
    };
    return AppResponse.success(HTTP_STATUS.OK, Role.name, [
      [...records],
      paginationInfo,
    ]);
  }

  @Get(ROLE_API.FIND_BY_ID)
  // @ApiResponse({ ...HTTP_STATUS.OK, type: Role })
  @ApiOperation({ summary: `-- Get ${Role.name} By ID` })
  public async findOneById(
    @Param('id') id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const record = await this.roleService.findOneById(id);
    if (!record) {
      return AppResponse.notFound(Role.name, 'id', id);
    }
    return AppResponse.success(HTTP_STATUS.OK, Role.name, record);
  }

  @Patch(ROLE_API.UPDATE)
  // @ApiResponse(HTTP_STATUS.UPDATE)
  @ApiOperation({ summary: `-- Update ${Role.name} By ID` })
  public async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.roleService.findOneById(id);
    if (user) {
      const result = await this.roleService.update(id, updateRoleDto);
      return AppResponse.success(HTTP_STATUS.UPDATE, Role.name, result);
    }
    return AppResponse.notFound(Role.name, `id`, id);
  }

  @Delete(ROLE_API.REMOVE)
  // @ApiResponse(HTTP_STATUS.DELETE)
  @ApiOperation({ summary: `-- Delete ${Role.name} By ID` })
  public async remove(
    @Param('id') id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.roleService.findOneById(id);
    if (user) {
      const result = await this.roleService.removeById(id);
      return AppResponse.success(HTTP_STATUS.DELETE, Role.name, result);
    }
    return AppResponse.notFound(Role.name, `id`, id);
  }
}
