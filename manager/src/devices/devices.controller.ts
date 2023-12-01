import {
  Body,
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  Post,
  UseFilters,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { TimerControlRequest } from '/src/devices/requests/timer-control.request';
import { Client } from '/src/devices/enums/client.enum';
import { TimerControlMessageType } from '/src/devices/types/timer-control-message.type';
import { StatusReportMessage } from '/src/devices/messages/status-report.message';
import { HttpExceptionFilter, RpcExceptionFilter } from '/libs/filters';

@Controller('timer')
@UseFilters(RpcExceptionFilter)
@UseFilters(HttpExceptionFilter)
export class DevicesController implements OnModuleInit {
  constructor(@Inject(Client.TIMERS) private readonly client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @MessagePattern('home/devices/+/state')
  create(@Payload() report: StatusReportMessage, @Ctx() context: MqttContext) {
    // TODO:  Save data to database fo processing
    // TODO: Send data via websocket to frontend
    Logger.log(JSON.stringify(report), context.getTopic());
  }

  @Post('control')
  updateTimerByDeviceCode(@Body() device: TimerControlRequest) {
    const topic = `home/devices/${device.code}/set`;
    const payload: TimerControlMessageType = {
      status: device.status,
      time: {
        min: device.minutes,
        sec: device.seconds,
      },
    };
    return this.client.emit(topic, payload);
  }
}
