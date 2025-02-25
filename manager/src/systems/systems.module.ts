import { Module } from '@nestjs/common';
import { SystemsService } from './services/systems.service';
import { SystemsController } from './systems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { System } from '/src/systems/entities/system.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Client } from '/src/systems/enum/client.enum';
import { SwitchService } from '/src/systems/controls/switch/switch.service';
import { SensorService } from '/src/systems/controls/sensor/sensor.service';
import { ControlService } from './services/control.service';
import { ComponentsModule } from '/src/components/components.module';
import { HttpModule } from '@nestjs/axios';
import { HttpOptions } from '/src/systems/enum/http.enum';
import { HttpClientService } from '/src/systems/services/http-client.service';
import { DeviceClientService } from '/src/systems/services/device-client.service';

@Module({
  imports: [
    HttpModule,
    ComponentsModule,
    TypeOrmModule.forFeature([System]),
    ClientsModule.register([
      {
        name: Client.SYSTEMS,
        transport: Transport.MQTT,
        options: {
          clientId: Client.SYSTEMS,
          clean: false, // We want session persistence
          will: {
            topic: `home/managers/${Client.SYSTEMS}/status`,
            payload: JSON.stringify({
              data: {
                who: Client.SYSTEMS,
                status: 'Disconnected',
              },
            }),
            qos: 1, // At least once delivery
            retain: false, // Don't retain the message
          },
        },
      },
    ]),
  ],
  controllers: [SystemsController],
  providers: [
    SystemsService,
    SwitchService,
    SensorService,
    ControlService,
    HttpClientService,
    {
      provide: Client.DEVICES,
      useClass: DeviceClientService,
    },
    {
      provide: HttpOptions.Options,
      useValue: {
        maxRetriesOnFail: 5,
        retryDelay: 1000,
        timeout: 5000,
        headers: {
          'User-Agent': 'Manager/1.0, Systems-controller',
        },
      },
    },
  ],
  exports: [SystemsService, ControlService],
})
export class SystemsModule {}
