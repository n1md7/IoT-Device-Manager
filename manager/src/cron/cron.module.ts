import { Module } from '@nestjs/common';
import { CronService } from '/src/cron/cron.service';
import { SystemsModule } from '/src/systems/systems.module';

@Module({
  imports: [SystemsModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
