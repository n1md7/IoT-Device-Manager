import { Injectable } from '@nestjs/common';
import { ControlAbstract } from '/src/systems/control/control.abstract';
import { Component } from '/src/components/entities/component.entity';

@Injectable()
export class TimerService extends ControlAbstract {
  async start(component: Component): Promise<void> {
    console.log('TimerService start');
  }

  async stop(component: Component): Promise<void> {
    console.log('TimerService stop');
  }
}
