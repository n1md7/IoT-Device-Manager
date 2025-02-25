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
import { WebhookHttpController } from '/src/devices/webhook-http.controller';

@Module({
  imports: [
    ComponentsModule,
    TypeOrmModule.forFeature([Device]),
    ClientsModule.register([
      {
        name: Client.DEVICES,
        transport: Transport.MQTT,
        options: {
          clientId: Client.DEVICES,
          clean: false, // We want session persistence
          will: {
            topic: `home/managers/${Client.DEVICES}/status`,
            payload: JSON.stringify({
              data: {
                who: Client.DEVICES,
                status: 'Disconnected',
              },
            }),
            qos: 1, // At least once delivery
            retain: false, // Don't retain the message
          },
        },
      },
    ]),
    FeedModule,
  ],
  controllers: [DevicesHttpController, DevicesMqttController, WebhookHttpController],
  providers: [DevicesService],
})
export class DevicesModule {}
