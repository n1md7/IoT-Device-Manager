import { ConflictException, HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { Repository } from 'typeorm';
import { DatabaseException } from '/libs/filters';
import { SwitchService } from '/src/systems/switch/switch.service';
import { TimerService } from '/src/systems/timer/timer.service';
import { SensorService } from '/src/systems/sensor/sensor.service';
import { ValveService } from '/src/systems/valve/valve.service';
import { Client } from '/src/systems/enum/client.enum';
import { ClientMqtt } from '@nestjs/microservices';
import { DeviceType } from '/src/devices/enums/type.enum';
import { UpdateSystemRequest } from '/src/systems/requests/update-system.request';
import { CreateSystemRequest } from '/src/systems/requests/create-system.request';

@Injectable()
export class SystemsService implements OnModuleInit {
  constructor(
    @InjectRepository(System) private readonly systemRepository: Repository<System>,
    @Inject(SwitchService) private readonly switchService: SwitchService,
    @Inject(TimerService) private readonly timerService: TimerService,
    @Inject(SensorService) private readonly sensorService: SensorService,
    @Inject(ValveService) private readonly valveService: ValveService,
    @Inject(Client.SYSTEMS) private readonly mqttClient: ClientMqtt,
  ) {}

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
      switch (component.device.type) {
        case DeviceType.SWITCH:
          await this.switchService.start(component);
          break;
        case DeviceType.TIMER:
          await this.timerService.start(component);
          break;
        case DeviceType.SENSOR:
          await this.sensorService.start(component);
          break;
        case DeviceType.VALVE:
          await this.valveService.start(component);
          break;
        default:
          throw new ConflictException(`Device type "${component.device.type}" not supported`);
      }
    }
  }

  async componentsStop(system: System) {
    for (const component of system.components) {
      switch (component.device.type) {
        case DeviceType.SWITCH:
          await this.switchService.stop(component);
          break;
        case DeviceType.TIMER:
          await this.timerService.stop(component);
          break;
        case DeviceType.SENSOR:
          await this.sensorService.stop(component);
          break;
        case DeviceType.VALVE:
          await this.valveService.stop(component);
          break;
        default:
          throw new ConflictException(`Device type "${component.device.type}" not supported`);
      }
    }
  }
}
