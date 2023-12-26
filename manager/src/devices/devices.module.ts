import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesHttpController } from './devices-http.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Client } from '/src/devices/enums/client.enum';
import { DevicesMqttController } from '/src/devices/devices-mqtt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from '/src/devices/entities/device.entity';
import { FeedModule } from '/src/feed/feed.module';
import { ComponentsModule } from '/src/components/components.module';

@Module({
  imports: [
    ComponentsModule,
    TypeOrmModule.forFeature([Device]),
    ClientsModule.register([
      {
        name: Client.DEVICES,
        transport: Transport.MQTT,
        options: {
          clientId: 'Devices-Module',
          clean: true,
          will: {
            topic: 'home/device-manager/disconnected',
            payload: '{"data": "Devices-Module"}',
            qos: 1,
            retain: false,
          },
        },
      },
    ]),
    FeedModule,
  ],
  controllers: [DevicesHttpController, DevicesMqttController],
  providers: [DevicesService],
})
export class DevicesModule {}
