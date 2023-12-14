import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from '/src/devices/entities/device.entity';
import { Repository } from 'typeorm';
import { DatabaseException } from '/libs/filters';
import { DeviceRegisterMessage } from '/src/devices/messages/device-register.message';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async getDeviceByCode(code: string) {
    return await this.deviceRepository.findOneBy({ code });
  }

  async createDevice(device: DeviceRegisterMessage): Promise<Device> {
    try {
      return await this.deviceRepository.save({
        code: device.code,
        type: device.type,
        name: device.name,
        version: device.version,
        description: device.description,
      });
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating device with code "${device.code}"`,
        error,
      });
    }
  }
}
