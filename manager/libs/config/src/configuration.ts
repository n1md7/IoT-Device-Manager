import { MqttOptions, Transport } from '@nestjs/microservices';
import { env } from 'node:process';

export const Configuration = () => ({
  http: {
    origin: env.ORIGIN,
    port: parseInt(env.PORT!, 10),
  },
  mqtt: {
    transport: Transport.MQTT,
    options: {
      url: env.MQTT_URL,
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
});
export type Configuration = ReturnType<typeof Configuration>;
