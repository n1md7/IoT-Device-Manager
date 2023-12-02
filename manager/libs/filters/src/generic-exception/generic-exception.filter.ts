import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpRequest } from '/libs/interceptors/request.type';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error | unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<HttpRequest>();
    const status = { code: 500, message: 'Internal Server Error' };

    if (exception instanceof HttpException) {
      status.code = exception.getStatus();
      status.message = exception.message;
    }

    return response.status(status.code).json({
      statusCode: status.code,
      message: status.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
