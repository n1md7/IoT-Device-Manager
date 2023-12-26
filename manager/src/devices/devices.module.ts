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
          clean: false, // We want session persistence
          will: {
            topic: 'home/device-manager/disconnected',
            // Payload irrelevant atm as it's not used
            // The device will continue to work even if the manager is down
            // Because it already has the information when to shut down
            // And internal(device-level) timer will take care of it
            payload: '{"data": {"cmd": "Reset", "who": "Device-Module"}}', // Not used atm, just for info
            qos: 1, // At least once delivery
            retain: true, // Retain the message, to be delivered to any new subscribers (the last known state)
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
