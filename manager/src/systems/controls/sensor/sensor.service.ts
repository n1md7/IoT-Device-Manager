import { Injectable } from '@nestjs/common';
import { Component } from '/src/components/entities/component.entity';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';

@Injectable()
export class SensorService extends AbstractControl {
  async start(component: Component): Promise<void> {
    console.log('SensorService start');
  }

  async stop(component: Component): Promise<void> {
    console.log('SensorService stop');
  }
}
