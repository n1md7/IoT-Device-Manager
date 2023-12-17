import { Module } from '@nestjs/common';
import { SystemsService } from './systems.service';
import { SystemsController } from './systems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';

@Module({
  imports: [TypeOrmModule.forFeature([System])],
  controllers: [SystemsController],
  providers: [SystemsService],
})
export class SystemsModule {}
