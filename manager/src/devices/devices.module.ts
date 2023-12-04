import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesHttpController } from './devices-http.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Client } from '/src/devices/enums/client.enum';
import { DevicesMqttController } from '/src/devices/devices-mqtt.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: Client.TIMERS,
        transport: Transport.MQTT,
        options: {
          clientId: 'Devices-Module',
        },
      },
    ]),
  ],
  controllers: [DevicesHttpController, DevicesMqttController],
  providers: [DevicesService],
})
export class DevicesModule {}
