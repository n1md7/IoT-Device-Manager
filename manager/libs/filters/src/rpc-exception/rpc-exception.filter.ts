import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MqttRequest } from '/libs/interceptors/request.type';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const request = host.switchToRpc().getContext<MqttRequest>();

    request.logger.error(exception.getError(), exception.stack, request.id);
  }
}
