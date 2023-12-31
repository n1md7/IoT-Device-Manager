import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { MqttRequest } from '/libs/interceptors/request.type';

@Injectable()
export class MessageLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToRpc().getContext<MqttRequest>();
    request.logger = new Logger(request.id, { timestamp: true });

    const topic = request.getTopic();
    const payload = this.getPayload(request);

    request.logger.log(`Started: Event ${topic} ${payload}`);

    return next.handle().pipe(
      tap(() => {
        request.logger.log(`Completed: Event ${topic} ${Date.now() - request.startTime}ms`);
      }),
      catchError((err) => {
        request.logger.error(`Failed: Event ${topic} ${JSON.stringify(err)}`);

        throw err; // rethrow error to be caught by the GenericExceptionFilter
      }),
    );
  }

  private getPayload(request: MqttRequest): string {
    try {
      return request.getPacket().payload.toString();
    } catch {}

    return 'Not able to parse payload';
  }
}
