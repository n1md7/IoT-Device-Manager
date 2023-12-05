import {
  Controller,
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
  async handleReport(
    @Payload() report: StatusReportMessage,
    @Ctx() context: MqttRequest,
  ) {
    // TODO:  Save data to database fo processing
    this.devicesService.handlePublish(report);

    context.logger.log(JSON.stringify(report));
  }
}
