/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Default base URL of the IoT device REST API (see `.env`). */
  readonly IOT_DEVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type ScheduleType = {
  id: number;
  name: string;
  hour: number;
  minute: number;
  weekdays: string;
  active: boolean;
  activateForSeconds: number;
};

type Deserialized = {
  id: number;
  name: string;
  startTime: {
    hour: number;
    minute: number;
  };
  endTime: {
    hour: number;
    minute: number;
  };
  weekdays: number[];
  active: boolean;
};

declare global {
  interface Window {
    scheduler: {
      formatNumber: (n: number) => string;
      formatTime: (n: { hour: number; minute: number }) => string;
      createCard(options: ScheduleType): {
        container: HTMLElement;
        weekdays: NodeListOf<HTMLElement>;
        startTime: HTMLInputElement;
        endTime: HTMLInputElement;
        active: HTMLSelectElement;
        id: number;
      };
      deserialize(card: ScheduleType): Deserialized;
      serialize(card: Deserialized): ScheduleType;
      fetchSchedules(): Promise<ScheduleType[]>;
      updateSchedule(payload: ScheduleType): Promise<void>;
      createSchedule(): Promise<ScheduleType>;
      removeSchedule(id: number): Promise<void>;
    };
  }
}

export { ScheduleType };
