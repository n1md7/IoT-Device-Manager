import { Injectable } from '@nestjs/common';
import { ControlAbstract } from '/src/systems/control/control.abstract';
import { Component } from '/src/components/entities/component.entity';

@Injectable()
export class SwitchService extends ControlAbstract {
  async start(component: Component): Promise<void> {
    console.log('SwitchService start');
  }

  async stop(component: Component): Promise<void> {
    console.log('SwitchService stop');
  }
}
