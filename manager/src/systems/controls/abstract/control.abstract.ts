import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { Component } from '/src/components/entities/component.entity';
import { Inject } from '@nestjs/common';
import { Client } from '/src/systems/enum/client.enum';
import { ClientMqtt } from '@nestjs/microservices';

export abstract class AbstractControl {
  constructor(@Inject(Client.SYSTEMS) protected readonly mqttClient: ClientMqtt) {}

  async start(component: Component, time: SystemTime): Promise<void> {}

  async stop(component: Component): Promise<void> {}

  protected getEmitTopic(component: Component): string {
    return `home/devices/${component.device.code}/set`;
  }
}
