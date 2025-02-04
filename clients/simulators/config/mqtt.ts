import { z } from 'zod';

const { env } = import.meta;
const configurationSchema = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string().optional(),
  password: z.string().optional(),
  clientId: z.string(),
});

export const mqtt = {
  host: env.MQTT_HOST,
  port: +env.MQTT_PORT,
  username: env.MQTT_USERNAME,
  password: env.MQTT_PASSWORD,
  clientId: env.MQTT_CLIENT_ID,
};

configurationSchema.parse(mqtt);
