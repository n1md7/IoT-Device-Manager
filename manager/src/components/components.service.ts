import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateComponentRequest } from '/src/components/requests/create-component.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Component } from '/src/components/entities/component.entity';
import { Repository } from 'typeorm';
import { System } from '/src/systems/entities/system.entity';
import { Device } from '/src/devices/entities/device.entity';
import { DatabaseException } from '/libs/filters';
import { UpdateComponentRequest } from '/src/components/requests/update-component.request';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component) private readonly componentRepository: Repository<Component>,
    @InjectRepository(System) private readonly systemRepository: Repository<System>,
    @InjectRepository(Device) private readonly deviceRepository: Repository<Device>,
  ) {}

  /** @throws DatabaseException */
  async create({ shared, systemId, deviceCode }: CreateComponentRequest) {
    try {
      const system = await this.systemRepository.findOneByOrFail({ id: systemId });
      const device = await this.deviceRepository.findOneByOrFail({ code: deviceCode });
      const component = this.componentRepository.create({
        device,
        system,
        shared,
      });

      return await this.componentRepository.save(component);
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating component with deviceCode: "${deviceCode}" and systemId: "${systemId}"`,
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        error,
      });
    }
  }

  async findAll() {
    return await this.componentRepository.findAndCount({
      relations: ['device', 'system'],
    });
  }

  async findById(id: number) {
    return await this.componentRepository.findOne({
      where: { id },
      relations: ['device'],
    });
  }

  /** @throws DatabaseException */
  async getById(id: number) {
    try {
      return await this.componentRepository.findOneOrFail({
        where: { id },
        relations: ['device'],
      });
    } catch (error) {
      throw new DatabaseException({
        message: `Error getting component with id: "${id}"`,
        code: HttpStatus.NOT_FOUND,
        error,
      });
    }
  }

  async updateById(id: number, payload: Partial<UpdateComponentRequest>) {
    return await this.componentRepository.update({ id }, payload);
  }

  async removeById(id: number) {
    try {
      return await this.componentRepository.delete({ id });
    } catch (error) {
      throw new DatabaseException({
        message: `Error deleting component with id: "${id}"`,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }

  async updateManyBy(components: Component[], payload: Partial<UpdateComponentRequest>) {
    try {
      for (const { id } of components) {
        await this.updateById(id, payload);
      }
    } catch (error) {
      throw new DatabaseException({
        message: `Error in bulk updating components`,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }

  async updateManyByDeviceCode(deviceCode: string, payload: Partial<UpdateComponentRequest>) {
    try {
      const components = await this.componentRepository.find({
        where: {
          device: {
            code: deviceCode,
          },
        },
      });
      await this.updateManyBy(components, payload);
    } catch (error) {
      throw new DatabaseException({
        message: `Error in bulk updating components`,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }
}
