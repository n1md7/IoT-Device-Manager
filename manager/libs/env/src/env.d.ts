declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test' | 'e2e';
      ORIGIN: string;
      PORT: string;
      MQTT_HOST: string;
      MQTT_PORT: string;
      MQTT_PROTOCOL: string;
      MQTT_USERNAME: string;
      MQTT_PASSWORD: string;
      MQTT_CLIENT_ID: string;
    }
  }
}

export {};
