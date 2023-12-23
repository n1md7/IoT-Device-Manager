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
  async create(payload: CreateComponentRequest) {
    try {
      const system = await this.systemRepository.findOneByOrFail({ id: payload.systemId });
      const device = await this.deviceRepository.findOneByOrFail({ code: payload.deviceCode });
      const component = this.componentRepository.create({
        device,
        system,
      });

      return await this.componentRepository.save(component);
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating component with deviceCode: "${payload.deviceCode}" and systemId: "${payload.systemId}"`,
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        error,
      });
    }
  }

  async findAll() {
    return await this.componentRepository.findAndCount({
      relations: ['device'],
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

  async updateById(id: number, payload: UpdateComponentRequest) {
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
}
