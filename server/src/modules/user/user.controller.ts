import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APP_CONSTANT } from 'src/shared/constants/app.constant';
import { User } from './schema/user.schema';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { USER_API } from 'src/shared/constants/endpoint.constant';
import { AppResponse, IHttpSuccess } from 'src/shared/services/response-status';
import { RoleService } from '../role/role.service';
import { Role } from '../role/schema/role.schema';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { ROLES, RolesGuard } from '../auth/guards/roles.guard';
import { hasRoles } from '../auth/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags(APP_CONSTANT.TAGS.USER.title)
@Controller({ path: APP_CONSTANT.MODULE_API.user })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post(USER_API.CREATE)
  // @ApiResponse(HTTP_STATUS.CREATED)
  @ApiOperation({ summary: `-- Create New ${User.name}` })
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IHttpSuccess | HttpException> {
    const role = await this.roleService.findOneByName(createUserDto.role);
    if (!role) {
      return AppResponse.notFound(Role.name, `name`, createUserDto.role);
    }
    // Update role with role._id
    createUserDto.role = role._id;
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user) {
      return AppResponse.conflict(User.name, `email`, createUserDto.email);
    }
    createUserDto.password = this.authService.generateHashPassword(
      createUserDto.password,
    );
    const result = await this.userService.create(createUserDto);
    return AppResponse.success(HTTP_STATUS.CREATED, User.name, result);
  }

  @Get(USER_API.FIND_ALL)
  // @ApiResponse({ ...HTTP_STATUS.OK })
  @ApiOperation({ summary: `-- Get All ${User.name}s` })
  public async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<IHttpSuccess> {
    const records = await this.userService.findAll(page, limit);
    const total = await this.userService.getTotalRow();
    const paginationInfo = {
      total,
    };
    return AppResponse.success(HTTP_STATUS.OK, User.name, [
      [...records],
      paginationInfo,
    ]);
  }

  @Get(USER_API.FIND_BY_ID)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(ROLES.USER)
  // @ApiResponse({ ...HTTP_STATUS.OK, type: User })
  @ApiOperation({ summary: `-- Get ${User.name} By ID` })
  public async findOneById(
    @Param('id') id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const record = await this.userService.findOneById(id);
    if (!record) {
      return AppResponse.notFound(User.name, 'id', id);
    }
    return AppResponse.success(HTTP_STATUS.OK, User.name, record);
  }

  @Patch(USER_API.UPDATE)
  // @ApiResponse(HTTP_STATUS.UPDATE)
  @ApiOperation({ summary: `-- Update ${User.name} By ID` })
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      return AppResponse.notFound(User.name, `id`, id);
    }
    // Check email
    if (updateUserDto?.email) {
      const email = await this.userService.findOneByEmail(updateUserDto.email);
      if (email) {
        return AppResponse.conflict(User.name, `email`, updateUserDto.email);
      }
    }
    // Check role
    if (updateUserDto?.role) {
      const role = await this.roleService.findOneByName(updateUserDto.role);
      if (!role) {
        return AppResponse.notFound(User.name, `role`, updateUserDto.role);
      }
    }
    const result = await this.userService.update(id, updateUserDto);
    return AppResponse.success(HTTP_STATUS.UPDATE, User.name, result);
  }

  @Delete(USER_API.REMOVE)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @hasRoles(ROLES.USER)
  @ApiOperation({ summary: `-- Delete ${User.name} By ID` })
  public async remove(
    @Param('id') id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.userService.findOneById(id);
    if (!user) {
      return AppResponse.notFound(User.name, `id`, id);
    }
    const result = await this.userService.removeById(id);
    return AppResponse.success(HTTP_STATUS.DELETE, User.name, result);
  }
}
