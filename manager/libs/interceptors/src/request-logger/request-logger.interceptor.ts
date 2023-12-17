import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { HttpRequest } from '/libs/interceptors/request.type';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<HttpRequest>();
    request.logger = new Logger(request.id, { timestamp: true });

    const { method, url, body, query, params } = request;
    const { userAgent } = request.headers;

    request.logger.log(
      `Started: ${method.toUpperCase()} ${url} ${JSON.stringify({
        body,
        query,
        params,
        userAgent,
      })}`,
    );

    return next.handle().pipe(
      tap(() => {
        request.logger.log(`Completed: ${method.toUpperCase()} ${url} in ${Date.now() - request.startTime}ms`);
      }),
      catchError((err) => {
        request.logger.error(`Failed: ${method.toUpperCase()} ${url} ${JSON.stringify(err)}`);

        throw err; // rethrow error to be caught by the GenericExceptionFilter
      }),
    );
  }
}
