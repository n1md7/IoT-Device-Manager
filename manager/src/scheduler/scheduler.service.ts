import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { System } from '/src/systems/entities/system.entity';
import { CreateScheduleRequest } from '/src/scheduler/requests/create-schedule.request';
import { DatabaseException } from '/libs/filters';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { Repository } from 'typeorm';
import { UpdateScheduleRequest } from '/src/scheduler/requests/update-schedule.request';
import { CronService } from '/src/cron/cron.service';
import { exit } from 'node:process';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @InjectRepository(Schedule) private readonly schedulerRepository: Repository<Schedule>,
    @Inject(CronService) private readonly cronService: CronService,
  ) {}

  async onModuleInit() {
    try {
      await this.addTasksFromDatabase();
    } catch (e) {
      this.logger.error(e);
      exit(1);
    }
  }

  private async addTasksFromDatabase() {
    const [schedules, count] = await this.findAll();

    this.logger.verbose(`Registering crons from the DB. Total: ${count}`);

    for (const schedule of schedules) {
      await this.cronService.addCronJob(schedule);
    }
  }

  async createBySystem(system: System, payload: CreateScheduleRequest) {
    try {
      const schedule = await this.schedulerRepository.save({
        ...payload,
        system,
      });
      await this.cronService.addCronJob(schedule);

      return schedule;
    } catch (error) {
      throw new DatabaseException({
        message: `Error creating schedule with name "${payload.name}"`,
        error,
      });
    }
  }

  async findAll() {
    try {
      return await this.schedulerRepository.findAndCount({
        relations: {
          system: {
            components: {
              device: true,
            },
          },
        },
      });
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
        code: HttpStatus.NOT_FOUND,
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
