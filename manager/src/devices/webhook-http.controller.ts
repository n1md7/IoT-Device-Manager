import { Body, Controller, HttpCode, HttpStatus, Inject, Put } from '@nestjs/common';
import { ApiAcceptedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwitchStatusRequest } from '/src/devices/requests/webhook/switch-status.request';
import { SensorStatusRequest } from '/src/devices/requests/webhook/sensor-status.request';
import { FeedService } from '/src/feed/feed.service';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { SwitchStatusReportMessage } from '/src/devices/messages/switch-status-report.message';
import { ComponentsService } from '/src/components/components.service';
import { DeviceType } from '/src/devices/enums/type.enum';
import { SensorStatusReportMessage } from '/src/devices/messages/sensor-status-report.message';

@ApiTags('Devices')
@Controller('devices/webhook/status')
export class WebhookHttpController {
  constructor(
    @Inject(FeedService) private readonly stream: FeedService,
    @Inject(ComponentsService) private readonly components: ComponentsService,
  ) {}

  @Put('SWITCH')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'Device SWITCH status received' })
  @ApiOperation({ summary: 'Status report for SWITCH', description: 'Provide device status update for SWITCH type' })
  async updateSwitchDevice(@Body() report: SwitchStatusRequest) {
    this.stream.push(
      new SwitchStatusReportMessage({
        type: DeviceType.SWITCH,
        code: report.code,
        name: report.name,
        version: report.version,
        status: report.status,
        time: report.timeRemaining,
      }),
    );

    await this.components.updateManyByDeviceCode(report.code, {
      inUse: report.status === DeviceStatus.ON,
    });
  }

  @Put('SENSOR')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'Device SENSOR reading received' })
  @ApiOperation({ summary: 'Status report for SENSOR', description: 'Provide device status update for SENSOR type' })
  async updateSensorDevice(@Body() body: SensorStatusRequest) {
    this.stream.push(
      new SensorStatusReportMessage({
        type: DeviceType.SENSOR,
        code: body.code,
        name: body.name,
        version: body.version,
        reading: body.reading,
      }),
    );
  }
}
