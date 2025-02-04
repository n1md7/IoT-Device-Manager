import { MqttOptions, Transport } from '@nestjs/microservices';
import { env, cwd } from 'node:process';
import { join } from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Env } from '/libs/env';

export const Configuration = () => ({
  http: {
    origin: env.ORIGIN,
    port: parseInt(env.PORT!, 10),
  },
  mqtt: {
    transport: Transport.MQTT,
    options: {
      host: env.MQTT_HOST,
      port: parseInt(env.MQTT_PORT!, 10),
      username: env.MQTT_USER,
      password: env.MQTT_PASS,
      clientId: 'IoT-Manager',
      subscribeOptions: {
        /**
         * The QoS
         * 0 - at most once delivery
         * 1 - at least once delivery
         * 2 - exactly once delivery
         *
         * We use QoS 1 because we want to make sure that the message is delivered at least once.
         * Duplication is possible, but it is not a problem for us.
         * In worst case scenario, the device will receive the same message twice.
         * Which will cause triggering the same action twice (e.g. turn on the light twice).
         */
        qos: 1,
      },
    },
  } satisfies MqttOptions,
  database: {
    // type: 'mysql',
    // host: env.DB_HOST,
    // port: parseInt(env.DB_PORT!, 10),
    // username: env.DB_USER,
    // password: env.DB_PASS,
    type: 'sqlite',
    database: env.DB_NAME,
    synchronize: true,
    logging: ['error', 'migration'],
    autoLoadEntities: true,
    entities: [join(cwd(), 'dist', '**', '*.entity.js')],
  } satisfies TypeOrmModuleOptions,
});
export type Configuration = ReturnType<typeof Configuration>;
