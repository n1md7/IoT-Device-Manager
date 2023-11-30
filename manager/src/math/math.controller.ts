import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('math')
export class MathController {
  constructor(@Inject('MATH_SERVICE') private readonly client: ClientProxy) {}

  @Get()
  execute(): Observable<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2, 3, 4, 5];
    return this.client.send<number>(pattern, data);
  }

  @MessagePattern({ cmd: 'sum' }, Transport.MQTT)
  sum(data: number[]): number {
    console.log('sum', data);
    return (data || []).reduce((a, b) => a + b);
  }

  @MessagePattern('home/devices/+/state')
  getNotifications(@Payload() data: Object, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`, data);
  }
}
