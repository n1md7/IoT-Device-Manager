import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { Repository } from 'typeorm';
import { Client } from '/src/systems/enum/client.enum';
import { ClientMqtt, MqttRecordBuilder } from '@nestjs/microservices';
import { UpdateSystemRequest } from '/src/systems/requests/update-system.request';
import { CreateSystemRequest } from '/src/systems/requests/create-system.request';
import { DatabaseException } from '/libs/filters';

@Injectable()
export class SystemsService implements OnModuleInit {
  constructor(
    @InjectRepository(System) private readonly systemRepository: Repository<System>,
    @Inject(Client.SYSTEMS) private readonly mqttClient: ClientMqtt,
  ) {}

  async onModuleInit() {
    await this.mqttClient.connect();
    await this.notifyStatus();
    await this.requestUpdates();
  }

  async requestUpdates() {
    return this.mqttClient.emit('home/devices/+/request-update', {});
  }

  async notifyStatus() {
    return this.mqttClient.emit(
      'home/managers/status',
      new MqttRecordBuilder({
        who: Client.SYSTEMS,
        status: 'Connected',
      })
        .setQoS(1)
        .setRetain(false)
        .build(),
    );
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
}
