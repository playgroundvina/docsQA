import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HTTP_STATUS } from '../constants/http-code.constant';

export interface IStatus {
  code: number;
  description: string;
}
export interface IHttpSuccess {
  status: IStatus;
  message: string;
  data: any[];
  error: string | null;
}

export enum IMethod {
  POST = 'POST',
  GET = 'GET',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  PATCH = 'PATCH',
}
export class AppResponse {
  static success(
    statusCode: IStatus,
    object: string,
    data?: any,
    message?: string,
  ): IHttpSuccess {
    const objectUpperCase = object?.toUpperCase();
    let resData: any[] = [];
    if (!data) {
      resData = [];
    } else if (typeof data === 'string') {
      resData = [data];
    } else if (data instanceof Object) {
      resData = Array.isArray(data) ? data : [data];
    }
    switch (statusCode) {
      case HTTP_STATUS.CREATED: {
        return {
          status: statusCode,
          message: message ?? `[${objectUpperCase}]: Create successfully!`,
          data: resData,
          error: null,
        };
      }
      case HTTP_STATUS.UPDATE: {
        return {
          status: statusCode,
          message: message ?? `[${objectUpperCase}]: Update successfully!`,
          data: resData,
          error: null,
        };
      }
      case HTTP_STATUS.DELETE: {
        return {
          status: statusCode,
          message: message ?? `[${objectUpperCase}]: Delete successfully!`,
          data: resData,
          error: null,
        };
      }
      default: {
        return {
          status: statusCode,
          message: message ?? `[${objectUpperCase}]: Query successfully!`,
          data: resData,
          error: null,
        };
      }
    }
  }

  static forbidden(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new ForbiddenException({
      message: message ?? `[${objectUpperCase}]: Not have role!`,
      status: HTTP_STATUS.FORBIDDEN,
    });
  }
  static unauthorized(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new UnauthorizedException({
      message:
        message ?? `[${objectUpperCase}]: Request must sent with a token!`,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  static badRequest(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new BadRequestException({
      message: message ?? `[${objectUpperCase}]: Invalid request!`,
      status: HTTP_STATUS.BAB_REQUEST,
    });
  }

  static tokenExpired(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new UnprocessableEntityException({
      message: message ?? `[${objectUpperCase}]: Token expired or invalid!`,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    });
  }

  static notAcceptable(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new NotAcceptableException({
      message: message ?? `[${objectUpperCase}]: Authentication failed!`,
      status: HTTP_STATUS.NOT_ACCEPT,
    });
  }

  static notFound(
    object: string,
    key?: string,
    value?: string,
    message?: string,
  ): HttpException {
    const objectUpperCase = object.toUpperCase();
    if (key || value) {
      throw new NotFoundException({
        message:
          message ??
          `[${objectUpperCase}]: Record ${key}="${value}" not found!`,
        status: HTTP_STATUS.NO_FOUND,
      });
    }
    throw new NotFoundException({
      message: message ?? `[${objectUpperCase}]: Record not found!`,
      status: HTTP_STATUS.NO_FOUND,
    });
  }

  static conflict(
    object: string,
    key?: string,
    value?: string,
    message?: string,
  ): HttpException {
    const objectUpperCase = object.toUpperCase();
    if (key || value) {
      throw new ConflictException({
        message:
          message ??
          `[${objectUpperCase}]: Record ${key}="${value}" already exist!`,
        status: HTTP_STATUS.CONFLICT,
      });
    }
    throw new ConflictException({
      message: message ?? `[${objectUpperCase}]: Record already exist`,
      status: HTTP_STATUS.CONFLICT,
    });
  }

  static serverError(object: string, message?: string): HttpException {
    const objectUpperCase = object.toUpperCase();
    throw new InternalServerErrorException({
      message: message ?? `[${objectUpperCase}]: Server is having error!`,
      status: HTTP_STATUS.SERVER_ERROR,
    });
  }
}
