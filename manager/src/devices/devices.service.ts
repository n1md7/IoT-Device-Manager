import { Injectable } from '@nestjs/common';
import { DatabaseException } from '/libs/filters';

@Injectable()
export class DevicesService {
  create(createDeviceDto: unknown) {
    // throw new DatabaseException({
    //   message: 'Error creating device',
    //   error: 'Error creating device',
    //   code: 500,
    // });
    return 'This action adds a new device';
  }

  findAll() {
    return `This action returns all devices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} device`;
  }

  update(id: number, updateDeviceDto: unknown) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
