import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from '/src/components/entities/component.entity';
import { System } from '/src/systems/entities/system.entity';
import { Device } from '/src/devices/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Component, System, Device])],
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule {}
