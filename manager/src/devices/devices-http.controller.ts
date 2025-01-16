import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { Client } from '/src/devices/enums/client.enum';
import { DevicesService } from '/src/devices/devices.service';
import { ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Device } from '/src/devices/entities/device.entity';
import { ClientMqtt } from '@nestjs/microservices';

@ApiTags('Devices')
@Controller('devices')
export class DevicesHttpController implements OnModuleInit {
  constructor(
    @Inject(Client.DEVICES) private readonly client: ClientMqtt,
    @Inject(DevicesService) private readonly devicesService: DevicesService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Get()
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
  @ApiOperation({ summary: 'Get devices', description: 'Get a list of devices' })
  async getDevices() {
    const [devices, count] = await this.devicesService.findAll();

    return {
      devices,
      count,
    };
  }
}
