import { Injectable } from '@nestjs/common';
import { Component } from '/src/components/entities/component.entity';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { DeviceOffMessage, DeviceOnMessage } from '/src/devices/types/device-control-message.type';

@Injectable()
export class SwitchService extends AbstractControl {
  override async start(component: Component, time: SystemTime): Promise<void> {
    const topic = this.getEmitTopic(component);
    const payload: DeviceOnMessage = {
      status: DeviceStatus.ON,
      time,
    };
    this.mqttClient.emit(topic, payload);
  }

  override async stop(component: Component): Promise<void> {
    const topic = this.getEmitTopic(component);
    const payload: DeviceOffMessage = {
      status: DeviceStatus.OFF,
    };
    this.mqttClient.emit(topic, payload);
  }
}
