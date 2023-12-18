import { ConflictException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { Repository } from 'typeorm';
import { DatabaseException } from '/libs/filters';
import { SwitchService } from '/src/systems/controls/switch/switch.service';
import { TimerService } from '/src/systems/controls/timer/timer.service';
import { SensorService } from '/src/systems/controls/sensor/sensor.service';
import { ValveService } from '/src/systems/controls/valve/valve.service';
import { Client } from '/src/systems/enum/client.enum';
import { ClientMqtt } from '@nestjs/microservices';
import { DeviceType } from '/src/devices/enums/type.enum';
import { UpdateSystemRequest } from '/src/systems/requests/update-system.request';
import { CreateSystemRequest } from '/src/systems/requests/create-system.request';
import { AbstractControl } from '/src/systems/controls/abstract/control.abstract';

@Injectable()
export class SystemsService implements OnModuleInit {
  private readonly mqttClient: ClientMqtt;
  private readonly systemRepository: Repository<System>;
  private readonly controls: Record<DeviceType, AbstractControl>;

  constructor(
    @InjectRepository(System) systemRepository: Repository<System>,
    @Inject(SwitchService) switchService: SwitchService,
    @Inject(TimerService) timerService: TimerService,
    @Inject(SensorService) sensorService: SensorService,
    @Inject(ValveService) valveService: ValveService,
    @Inject(Client.SYSTEMS) mqttClient: ClientMqtt,
  ) {
    this.systemRepository = systemRepository;
    this.mqttClient = mqttClient;
    this.controls = {
      [DeviceType.SWITCH]: switchService,
      [DeviceType.TIMER]: timerService,
      [DeviceType.SENSOR]: sensorService,
      [DeviceType.VALVE]: valveService,
    };
  }

  async onModuleInit() {
    await this.mqttClient.connect();
  }

  async create(payload: CreateSystemRequest) {
    try {
      return await this.systemRepository.save(payload);
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating system with name "${payload.name}"`,
        error,
      });
    }
  }

  async findAll() {
    return await this.systemRepository.findAndCount({
      relations: {
        components: {
          device: true,
        },
      },
    });
  }

  async getById(id: number) {
    try {
      return await this.systemRepository.findOneOrFail({
        where: { id },
        relations: {
          components: {
            device: true,
          },
        },
      });
    } catch (error) {
      throw new DatabaseException({
        message: `Error finding system with id "${id}"`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  async findById(id: number) {
    return await this.systemRepository.findOne({
      where: { id },
    });
  }

  async removeById(id: number) {
    return await this.systemRepository.delete(id);
  }

  async updateById(id: number, system: UpdateSystemRequest) {
    return await this.systemRepository.update(id, system);
  }

  async componentsStart(system: System) {
    for (const component of system.components) {
      await this.controls[component.device.type].start(component);
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
