declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      ORIGIN: string;
      PORT: string;
      MQTT_URL: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
    }
  }
}

export {};
