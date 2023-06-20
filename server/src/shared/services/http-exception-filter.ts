import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { IStatus } from './response-status';

export interface IExceptionResponse {
  message: string;
  status: IStatus;
}
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const customStatus = (exception.getResponse() as IExceptionResponse).status;
    const statusCode = customStatus?.code ?? '505';
    const message = exception.message;
    const error = exception.name;

    return response.status(statusCode).json({
      status: customStatus,
      message,
      timestamp: new Date().toISOString(),
      data: [],
      error,
    });
  }
}
