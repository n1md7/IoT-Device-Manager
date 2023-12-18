import { Injectable } from '@nestjs/common';
import { Component } from '/src/components/entities/component.entity';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { SwitchControlMessageType } from '/src/devices/types/switch-control-message.type';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';

@Injectable()
export class SwitchService extends AbstractControl {
  async start(component: Component): Promise<void> {
    const topic = this.getEmitTopic(component);
    const payload: SwitchControlMessageType = {
      status: DeviceStatus.ON,
    };
    this.mqttClient.emit(topic, payload);
  }

  async stop(component: Component): Promise<void> {
    const topic = this.getEmitTopic(component);
    const payload: SwitchControlMessageType = {
      status: DeviceStatus.OFF,
    };
    this.mqttClient.emit(topic, payload);
  }
}
