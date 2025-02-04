declare module 'bun' {
  interface Env {
    MQTT_HOST: string;
    MQTT_PORT: number;
    MQTT_USERNAME: string;
    MQTT_PASSWORD: string;
    MQTT_PROTOCOL: string;
    MQTT_CLIENT_ID: string;
  }
}
