import {
  Body,
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  Post,
  Req,
  Sse,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TimerControlRequest } from '/src/devices/requests/timer-control.request';
import { Client } from '/src/devices/enums/client.enum';
import { TimerControlMessageType } from '/src/devices/types/timer-control-message.type';
import { DevicesService } from '/src/devices/devices.service';
import { ReqLogger } from '/libs/decorators';
import { catchError, map, throwError } from 'rxjs';
import { Request } from 'express';

@Controller('timer')
export class DevicesHttpController implements OnModuleInit {
  constructor(
    @Inject(Client.TIMERS) private readonly client: ClientProxy,
    @Inject(DevicesService) private readonly devicesService: DevicesService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post('control')
  async updateTimerByDeviceCode(
    @Body() device: TimerControlRequest,
    @ReqLogger() logger: Logger,
  ) {
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

  @Sse('updates')
  async updates(@Req() request: Request) {
    const { id, observer } = this.devicesService.createStream();
    request.on('close', () => this.devicesService.removeStream(id));

    return observer.pipe(
      map((data) => {
        return {
          type: 'message',
          data,
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }
}
