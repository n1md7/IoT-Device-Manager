import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MqttRequest } from '/libs/interceptors/request.type';

@Injectable()
export class MessageIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToRpc().getContext<MqttRequest>();

    request.id = uuidv4();
    request.startTime = Date.now();

    return next.handle();
  }
}
