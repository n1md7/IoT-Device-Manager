import {
  Controller,
  Logger,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { StatusReportMessage } from '/src/devices/messages/status-report.message';
import { RpcExceptionFilter } from '/libs/filters';
import { DevicesService } from '/src/devices/devices.service';
import { MessageLoggerInterceptor } from '/libs/interceptors/message-logger/message-logger.interceptor';
import { TimeoutInterceptor } from '/libs/interceptors/timeout/timeout.interceptor';
import { MessageIdInterceptor } from '/libs/interceptors/message-id/message-id.interceptor';
import { MsgLogger } from '/libs/decorators/message/msg-logger/msg-logger.decorator';
import { MqttRequest } from '/libs/interceptors/request.type';

@UseFilters(RpcExceptionFilter)
@UseInterceptors(
  MessageIdInterceptor,
  MessageLoggerInterceptor,
  TimeoutInterceptor,
)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
@Controller('timer')
export class DevicesMqttController {
  constructor(private readonly devicesService: DevicesService) {}

  @MessagePattern('home/devices/+/state')
  async create(
    @Payload() report: StatusReportMessage,
    @Ctx() context: MqttRequest,
    @MsgLogger() logger: Logger,
  ) {
    // TODO:  Save data to database fo processing
    // TODO: Send data via websocket to frontend

    context.logger.log(JSON.stringify(report));
  }
}
