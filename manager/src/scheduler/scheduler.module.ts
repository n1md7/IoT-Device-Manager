import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '/src/scheduler/entities/scheduler.entity';
import { SystemsModule } from '/src/systems/systems.module';

@Module({
  imports: [SystemsModule, TypeOrmModule.forFeature([Schedule])],
  controllers: [SchedulerController],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
