import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '/src/devices/entities/device.entity';
import { Repository } from 'typeorm';
import { DatabaseException } from '/libs/filters';
import { DeviceRegisterMessage } from '/src/devices/messages/device-register.message';
import { Cached } from '/libs/decorators/cache/method-cache.decorator';
import { ClientMqtt, MqttRecordBuilder } from '@nestjs/microservices';
import { Client } from '/src/devices/enums/client.enum';

@Injectable()
export class DevicesService implements OnModuleInit {
  constructor(
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
    @Inject(Client.DEVICES) private readonly mqttClient: ClientMqtt,
  ) {}

  async onModuleInit() {
    await this.mqttClient.connect();
    await this.notifyStatus();
  }

  async notifyStatus() {
    return this.mqttClient.emit(
      'home/managers/status',
      new MqttRecordBuilder({
        who: Client.DEVICES,
        status: 'Connected',
      })
        .setQoS(1)
        .setRetain(false)
        .build(),
    );
  }

  @Cached('5m')
  async getDeviceByCode(code: string) {
    return await this.deviceRepository.findOne({
      where: { code },
    });
  }

  @Cached('5m')
  async deviceMissing(code: string) {
    return !(await this.deviceRepository.findOneBy({ code }));
  }

  @Cached('5m')
  async findAll() {
    return await this.deviceRepository.findAndCount();
  }

  async createDevice(device: DeviceRegisterMessage): Promise<Device> {
    try {
      return await this.deviceRepository.save({
        code: device.code,
        type: device.type,
        name: device.name,
        version: device.version,
      });
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating device with code "${device.code}"`,
        error,
      });
    }
  }

  async softCreateDevice(device: DeviceRegisterMessage) {
    if (await this.deviceMissing(device.code)) {
      return await this.createDevice(device);
    }
  }

  async updateDevice(device: Partial<Device>) {
    return await this.deviceRepository.update({ code: device.code }, device);
  }
}
