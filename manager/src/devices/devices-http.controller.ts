import { Body, Controller, Get, Inject, OnModuleInit, Post, Req, Sse } from '@nestjs/common';
import { TimerControlMessageType } from '/src/devices/types/timer-control-message.type';
import { TimerControlRequest } from '/src/devices/requests/timer-control.request';
import { Client } from '/src/devices/enums/client.enum';
import { DevicesService } from '/src/devices/devices.service';
import { catchError, map, throwError } from 'rxjs';
import { StreamService } from '/src/devices/stream.service';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Device } from '/src/devices/entities/device.entity';
import { ClientMqtt } from '@nestjs/microservices';
import { Request } from 'express';

@ApiTags('Timer')
@Controller('timer')
export class DevicesHttpController implements OnModuleInit {
  constructor(
    @Inject(Client.DEVICES) private readonly client: ClientMqtt,
    @Inject(DevicesService) private readonly devicesService: DevicesService,
    @Inject(StreamService) private readonly streamService: StreamService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get('devices')
  @ApiTags('Devices')
  @ApiOkResponse({
    schema: {
      properties: {
        devices: {
          type: 'array',
          description: 'List of devices',
          items: {
            $ref: getSchemaPath(Device),
          },
        },
        count: {
          type: 'integer',
          description: 'Total number of devices',
        },
      },
    },
  })
  async getDevices() {
    const [devices, count] = await this.devicesService.findAll();

    return {
      devices,
      count,
    };
  }

  @Post('control')
  async updateTimerByDeviceCode(@Body() device: TimerControlRequest) {
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
    const { id, observer } = this.streamService.create();

    request.on('close', () => this.streamService.remove(id));

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
