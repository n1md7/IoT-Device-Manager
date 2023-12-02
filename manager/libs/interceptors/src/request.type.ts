import { Request } from 'express';
import { Logger } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';

export type HttpRequest = Request & {
  id: string;
  logger: Logger;
  startTime: number;
};

export type MqttRequest = MqttContext & {
  id: string;
  logger: Logger;
  startTime: number;
};
