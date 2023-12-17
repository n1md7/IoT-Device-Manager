import { Component } from '/src/components/entities/component.entity';

export abstract class ControlAbstract {
  async start(component: Component): Promise<void> {}

  async stop(component: Component): Promise<void> {}
}
