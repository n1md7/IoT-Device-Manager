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
    const status = { code: 500, message: 'Internal Server Error', details: '' };

    if (exception instanceof HttpException) {
      status.code = exception.getStatus();
      status.message = exception.message;
      status.details = this.extractDetails(exception);
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
      details: status.details,
    });
  }

  private extractDetails(exception: HttpException) {
    const response = exception.getResponse();
    if (typeof response === 'string') return response;

    if (typeof response === 'object') {
      const { message } = response as Record<string, unknown>;
      if (typeof message === 'string') return message;
      if (Array.isArray(message)) return message.join(', ');
    }

    return '';
  }
}
