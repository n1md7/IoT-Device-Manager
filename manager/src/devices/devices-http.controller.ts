import { Body, Controller, Get, HttpCode, HttpStatus, Inject, OnModuleInit, Param, Patch, Post } from '@nestjs/common';
import { Client } from '/src/devices/enums/client.enum';
import { DevicesService } from '/src/devices/devices.service';
import { ApiAcceptedResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Device } from '/src/devices/entities/device.entity';
import { ClientMqtt } from '@nestjs/microservices';
import { CreateDeviceRequest } from '/src/devices/requests/create-device.request';
import { UpdateDeviceRequest } from '/src/devices/requests/update-device.request';

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

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ status: HttpStatus.CREATED })
  @ApiOperation({ summary: 'Create device', description: 'Soft create a new device. If it exists, it will skip.' })
  async softCreate(@Body() body: CreateDeviceRequest) {
    await this.devicesService.softCreateDevice(body);
  }

  @Patch('update/:code')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'Device updated' })
  @ApiOperation({ summary: 'Update device', description: 'Update a device' })
  async updateDevice(@Param('code') code: string, @Body() body: UpdateDeviceRequest) {
    await this.devicesService.updateDevice(code, body);
  }
}
