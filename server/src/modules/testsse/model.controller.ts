
import ModelService from './model.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { IHttpSuccess, AppResponse } from 'src/shared/services/response-status';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import Constants from './constants';

import { Controller, Get, MessageEvent, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags(Constants.tag)
@Controller({ path: Constants.path })
class ModelController {
  constructor(private readonly modelService: ModelService) { }
  @Get('/test')
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Sse('sse')
  sse(): any {
    return interval(1000).pipe(
      map((_) => ({ data: { hello: 'world' } } as MessageEvent)),
    );
  }
}
export default ModelController;
