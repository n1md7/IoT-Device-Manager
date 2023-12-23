import { Injectable } from '@nestjs/common';
import { System } from '/src/systems/entities/system.entity';
import { CreateScheduleRequest } from '/src/scheduler/requests/create-schedule.request';
import { DatabaseException } from '/libs/filters';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { Repository } from 'typeorm';
import { UpdateScheduleRequest } from '/src/scheduler/requests/update-schedule.request';

@Injectable()
export class SchedulerService {
  constructor(@InjectRepository(Schedule) private readonly schedulerRepository: Repository<Schedule>) {}

  async createBySystem(system: System, payload: CreateScheduleRequest) {
    try {
      return await this.schedulerRepository.save({
        ...payload,
        system,
      });
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating schedule with name "${payload.name}"`,
        error,
      });
    }
  }

  async findAll() {
    try {
      return await this.schedulerRepository.findAndCount();
    } catch (error) {
      throw new DatabaseException({
        message: `Error finding schedules`,
        error,
      });
    }
  }

  async findOne(id: number) {
    try {
      return await this.schedulerRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new DatabaseException({
        message: `Error finding schedule with id "${id}"`,
        error,
      });
    }
  }

  async update(id: number, updateSchedulerDto: UpdateScheduleRequest) {
    try {
      return await this.schedulerRepository.update(id, updateSchedulerDto);
    } catch (error) {
      throw new DatabaseException({
        message: `Error updating schedule with id "${id}"`,
        error,
      });
    }
  }

  async removeById(id: number) {
    try {
      return await this.schedulerRepository.delete(id);
    } catch (error) {
      throw new DatabaseException({
        message: `Error deleting schedule with id "${id}"`,
        error,
      });
    }
  }
}
