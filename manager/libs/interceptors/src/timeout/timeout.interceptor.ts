import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(@Optional() private readonly timeout: number = 5_000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isRpc = context.getType() === 'rpc'; // Otherwise it's HTTP

    return next.handle().pipe(
      timeout(this.timeout), // Throw TimeoutError after {timout} seconds
      catchError((error: unknown, caught) => {
        if (error instanceof TimeoutError) {
          if (isRpc) {
            return throwError(
              () =>
                new RpcException({
                  name: error.name,
                  info: error.info,
                  message: error.message,
                }),
            );
          }

          // Otherwise it's HTTP
          return throwError(
            () =>
              new RequestTimeoutException({
                name: error.name,
                info: error.info,
                message: error.message,
              }),
          );
        }

        // rethrow error to be caught by the GenericExceptionFilter
        // Includes stack trace, it's unexpected error, so we want to see it
        return throwError(() => error);
      }),
    );
  }
}
