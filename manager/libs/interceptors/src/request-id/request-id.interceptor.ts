import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { HttpRequest } from '/libs/interceptors/request.type';

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<HttpRequest>();

    request.startTime = Date.now();
    request.id = request.get('X-Request-Id') || uuidv4();

    return next.handle();
  }
}
