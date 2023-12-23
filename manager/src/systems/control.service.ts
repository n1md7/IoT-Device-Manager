import { ConflictException, Injectable } from '@nestjs/common';
import { System } from '/src/systems/entities/system.entity';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { DeviceType } from '/src/devices/enums/type.enum';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';
import { SwitchService } from '/src/systems/controls/switch/switch.service';
import { SensorService } from '/src/systems/controls/sensor/sensor.service';

@Injectable()
export class ControlService {
  private readonly controls: Record<DeviceType, AbstractControl>;

  constructor(switchService: SwitchService, sensorService: SensorService) {
    this.controls = {
      [DeviceType.SWITCH]: switchService,
      [DeviceType.SENSOR]: sensorService,
    };
  }

  async componentsStart(system: System, time: SystemTime) {
    for (const component of system.components) {
      await this.controls[component.device.type].start(component, time);
    }
  }

  async componentsStop(system: System) {
    for (const component of system.components) {
      await this.controls[component.device.type].stop(component);
    }
  }

  assertSystemComponents(system: System) {
    for (const component of system.components) {
      if (!this.controls[component.device.type]) {
        throw new ConflictException(`Device type "${component.device.type}" not supported`);
      }
    }
  }

  assertSystemComponentsInUse(system: System) {
    for (const component of system.components) {
      if (component.inUse && !component.shared) {
        throw new ConflictException(`System ${system.name} is already in use`);
      }
    }
  }
}
