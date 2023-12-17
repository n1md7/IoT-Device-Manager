import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { DatabaseException } from '/libs/filters/exceptions/database.exception';
import { HttpRequest } from '/libs/interceptors/request.type';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error | unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<HttpRequest>();
    const status = { code: 500, message: 'Internal Server Error' };

    if (exception instanceof HttpException) {
      status.code = exception.getStatus();
      status.message = exception.message;
    }

    if (exception instanceof DatabaseException) {
      status.code = exception.code || 500;
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
