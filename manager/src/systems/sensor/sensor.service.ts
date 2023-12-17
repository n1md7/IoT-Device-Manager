import { Injectable } from '@nestjs/common';
import { ControlAbstract } from '/src/systems/control/control.abstract';
import { Component } from '/src/components/entities/component.entity';

@Injectable()
export class SensorService extends ControlAbstract {
  async start(component: Component): Promise<void> {
    console.log('SensorService start');
  }

  async stop(component: Component): Promise<void> {
    console.log('SensorService stop');
  }
}
