import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '/src/devices/entities/device.entity';
import { Repository } from 'typeorm';
import { DatabaseException } from '/libs/filters';
import { DeviceRegisterMessage } from '/src/devices/messages/device-register.message';
import { Cached } from '/libs/decorators/cache/method-cache.decorator';
@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  @Cached('5m')
  async getDeviceByCode(code: string) {
    return await this.deviceRepository.findOneBy({ code });
  }

  @Cached('5m')
  async deviceMissing(code: string) {
    return !(await this.deviceRepository.findOneBy({ code }));
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
}
