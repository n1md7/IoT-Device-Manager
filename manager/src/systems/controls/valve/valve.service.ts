import { Injectable } from '@nestjs/common';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';
import { Component } from '/src/components/entities/component.entity';

@Injectable()
export class ValveService extends AbstractControl {
  async start(component: Component): Promise<void> {
    console.log('ValveService start');
  }

  async stop(component: Component): Promise<void> {
    console.log('ValveService stop');
  }
}
