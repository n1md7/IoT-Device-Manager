import { Injectable } from '@nestjs/common';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';
import { Component } from '/src/components/entities/component.entity';
import { TimerControlMessageType } from '/src/devices/types/timer-control-message.type';
import { DeviceStatus } from '/src/devices/enums/status.enum';

@Injectable()
export class TimerService extends AbstractControl {
  async start(component: Component): Promise<void> {
    console.info('TimerService.start');
    const topic = this.getEmitTopic(component);
    const payload: TimerControlMessageType = {
      status: DeviceStatus.ON,
      time: {
        // TODO: remove hardcoded values
        min: 10,
        sec: 7,
      },
    };
    this.mqttClient.emit(topic, payload);
  }

  async stop(component: Component): Promise<void> {
    const topic = this.getEmitTopic(component);
    const payload: TimerControlMessageType = {
      status: DeviceStatus.OFF,
    };
    this.mqttClient.emit(topic, payload);
  }
}
