import { HttpException, Injectable } from '@nestjs/common';
import { Component } from '/src/components/entities/component.entity';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { DeviceOffMessage, DeviceOnMessage } from '/src/devices/types/device-control-message.type';
import { MqttRecordBuilder } from '@nestjs/microservices';

@Injectable()
export class SwitchService extends AbstractControl {
  override async start(component: Component, time: SystemTime): Promise<void> {
    if (component.device.ipAddress) {
      return await this.startOverHttp(component, time);
    }

    this.startOverMqtt(component, time);
  }

  override async stop(component: Component): Promise<void> {
    if (component.device.ipAddress) {
      return await this.stopOverHttp(component);
    }

    this.stopOverMqtt(component);
  }

  private startOverMqtt(component: Component, time: SystemTime) {
    const topic = this.getEmitTopic(component);
    const payload: DeviceOnMessage = {
      status: DeviceStatus.ON,
      time,
    };
    this.mqttClient.emit(topic, new MqttRecordBuilder(payload).setQoS(1).setRetain(false).build());
  }

  private async startOverHttp(component: Component, time: SystemTime) {
    await this.httpClient.startSwitch(component.device.ipAddress!, time.min, time.sec);
  }

  private async stopOverHttp(component: Component) {
    await this.httpClient.stopSwitch(component.device.ipAddress!);
  }

  private stopOverMqtt(component: Component) {
    const topic = this.getEmitTopic(component);
    const payload: DeviceOffMessage = {
      status: DeviceStatus.OFF,
    };

    this.mqttClient.emit(topic, new MqttRecordBuilder(payload).setQoS(1).setRetain(false).build());
  }
}
