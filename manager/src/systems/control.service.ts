import { ConflictException, Injectable } from '@nestjs/common';
import { System } from '/src/systems/entities/system.entity';
import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { DeviceType } from '/src/devices/enums/type.enum';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';
import { SwitchService } from '/src/systems/controls/switch/switch.service';
import { SensorService } from '/src/systems/controls/sensor/sensor.service';
import { ComponentsService } from '/src/components/components.service';

@Injectable()
export class ControlService {
  private readonly controls: Record<DeviceType, AbstractControl>;
  private readonly components: ComponentsService;

  constructor(switchService: SwitchService, sensorService: SensorService, componentsService: ComponentsService) {
    this.controls = {
      [DeviceType.SWITCH]: switchService,
      [DeviceType.SENSOR]: sensorService,
    };
    this.components = componentsService;
  }

  async componentsStart(system: System, time: SystemTime) {
    for (const component of system.components) {
      await this.components.updateManyBy(system.components, { inUse: true });
      await this.controls[component.device.type].start(component, time);
    }
  }

  async componentsStop(system: System) {
    for (const component of system.components) {
      await this.components.updateManyBy(system.components, { inUse: false });
      await this.controls[component.device.type].stop(component);
    }
  }

  /** @throws {ConflictException} */
  assertSystemComponents(system: System) {
    for (const component of system.components) {
      if (!this.controls[component.device.type]) {
        throw new ConflictException(`Device type "${component.device.type}" not supported`);
      }
    }
  }

  /**
   * @Description It makes sure the component is not used by other system, or it has to be shared one (like sensors)
   * @throws {ConflictException} */
  assertSystemComponentsInUse(system: System) {
    for (const component of system.components) {
      if (component.inUse && !component.shared) {
        throw new ConflictException(`Conflict! System "${system.name}" is already in use!`);
      }
    }
  }
}
