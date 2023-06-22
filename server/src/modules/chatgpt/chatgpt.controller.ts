import {
  Body,
  Delete,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Controller, Get, MessageEvent, Res, Sse
} from '@nestjs/common';
import ModelService from './chatgpt.service';
// import ServerSentEvent from 'rxjs/internal/observable/fromEvent';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS } from 'src/shared/constants/http-code.constant';
import { IHttpSuccess, AppResponse } from 'src/shared/services/response-status';
import CreateModelDto from './dto/create.dto';
import UpdateModelDto from './dto/update.dt';
import ModelSchema from './schema/model.schema';
import Constants from './constants';
import { Types } from 'mongoose';


import { fromEvent } from "rxjs";
import { EventEmitter } from "events";


import { } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';


@ApiTags(Constants.tag)
@Controller({ path: Constants.path })
class ModelController {
  constructor(private readonly modelService: ModelService) { }

  @Post('test')
  posttest(@Res() response: Response) {
    // const a = ServerSentEvent.fromEvent()


  }

  // @Post('stream')
  // @Sse()
  // async streamData(): Promise<Observable<object>> {
  //   let body = new CreateModelDto()
  //   body.content = "hãy tóm tắt nội dung chính"
  //   body.language = "vietnamese"
  //   const id = '64925b8c2fbe762d3180863f'

  //   await this.modelService.chatStream(id, body);
  //   const token$ = this.modelService.getTokenStream();
  //   return token$.pipe(
  //     map((token) => ({ data: { token } })),
  //   );


  // }

  @Get('test')
  index(@Res() response: Response) {
    response.type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Get('quanglai')
  quanglai(@Res() res: Response) {
    return interval(5000).pipe(
      map((count) => {
        res.write(`Đây là lần trả về thứ ${count + 1}.\n`);
        if (count === 3) {
          res.end();
        }
        return '';
      }),
    );
  }


  // @Sse('sse')
  // async sse(): Promise<Observable<MessageEvent>> {
  //   let body = new CreateModelDto()
  //   body.content = "hãy tóm tắt nội dung chính"
  //   body.language = "vietnamese"
  //   const id = '64925b8c2fbe762d3180863f'
  //   return await this.modelService.chatStream(id, body);
  // }

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
    const result = await this.modelService.chat(id, body)
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, result);
  }

  @Post(Constants.endpoint.CHATSTREAM)
  @ApiOperation({ summary: `-- chat Steam with ${ModelSchema.name}` })
  public async chatSteam(
    @Param('id') id: string,
    @Body() body: CreateModelDto,
    @Res() response: Response
  ): Promise<IHttpSuccess | HttpException> {
    const result = await this.modelService.chatStream(id, body, response)
    return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, result);
  }

  // @Post(Constants.endpoint.CHATSTREAM)
  // @ApiOperation({ summary: `-- chat Steam with ${ModelSchema.name}` })
  // public async chatSteam(
  //   @Param('id') id: string,
  //   @Body() body: CreateModelDto,
  // ): Promise<Observable<MessageEvent>> {
  //   const result = await this.modelService.chatStream(id, body)
  //   console.log({ result });
  //   return result
  //   // return AppResponse.success(HTTP_STATUS.OK, ModelSchema.name, result);
  // }

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
