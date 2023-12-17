import { Injectable } from '@nestjs/common';
import { ControlAbstract } from '/src/systems/control/control.abstract';
import { Component } from '/src/components/entities/component.entity';
import { DeviceStatus } from '/src/devices/enums/status.enum';
import { SwitchControlMessageType } from '/src/devices/types/switch-control-message.type';

@Injectable()
export class SwitchService extends ControlAbstract {
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
