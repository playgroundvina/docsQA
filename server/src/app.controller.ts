import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { APP_CONSTANT } from './shared/constants/app.constant';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from './shared/constants/http-code.constant';
import { AppResponse } from './shared/services/response-status';

@ApiTags(APP_CONSTANT.TAGS.TEST.title)
@Controller({ path: APP_CONSTANT.MODULE_API.test })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse(HTTP_STATUS.OK)
  @ApiOperation({ summary: `-- Say something...` })
  public async sayHello() {
    const data = await this.appService.sayHello();
    return AppResponse.success(HTTP_STATUS.OK, 'Test', data);
  }
}
