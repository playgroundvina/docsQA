import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { APP_CONSTANT } from 'src/shared/constants/app.constant';
import { RegisterDto } from './dto/register.dto';
import { IHttpSuccess, AppResponse } from 'src/shared/services/response-status';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { AUTH_API } from 'src/shared/constants/endpoint.constant';

@ApiTags(APP_CONSTANT.TAGS.AUTH.title)
@Controller({ path: APP_CONSTANT.MODULE_API.auth })
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post(AUTH_API.REGISTER)
  // @ApiResponse({ ...HTTP_STATUS.CREATED })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      return AppResponse.conflict(`Auth`, `email`, registerDto.email);
    }
    const result = await this.authService.register(registerDto);
    return AppResponse.success(HTTP_STATUS.CREATED, 'Auth', result);
  }

  @Post(AUTH_API.LOGIN)
  // @ApiResponse(HTTP_STATUS.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this.authService.findOneByEmail(loginDto.email);
    if (!user) {
      return AppResponse.notFound('Auth', 'email', loginDto.email);
    }
    const isMatchPassword = await this.authService.comparePasswords(
      loginDto.password,
      user.password,
    );
    if (!isMatchPassword) {
      return AppResponse.badRequest('Auth: Password Failed');
    }
    const result = await this.authService.login(user);
    return AppResponse.success(HTTP_STATUS.OK, 'Auth', result);
  }
}
