import { SystemTime } from '/src/systems/requests/properties/system-time.property';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { ControlService } from '/src/systems/control.service';
import { plainToInstance } from 'class-transformer';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  private readonly crons: Map<string, CronJob> = new Map();

  constructor(@Inject(ControlService) private readonly controlService: ControlService) {}

  async addCronJob(schedule: Schedule) {
    const cron = new CronJob(schedule.startExpression, this.componentStart.bind(this, schedule));

    this.logger.log(`Added cron job for schedule "${schedule.name}"`);

    this.crons.set(schedule.name, cron);

    cron.start();
  }

  removeCronJob(name: string) {
    return this.crons.delete(name);
  }

  private async componentStart(schedule: Schedule) {
    const duration = plainToInstance(SystemTime, schedule.duration);

    this.logger.verbose(`Starting system "${schedule.system.name}" for ${duration.toString()}`);

    await this.controlService.componentsStart(schedule.system, duration);
  }
}
