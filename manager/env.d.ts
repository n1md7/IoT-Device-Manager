declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      ORIGIN: string;
      PORT: string;
      MQTT_URL: string;
    }
  }
}

export {}
