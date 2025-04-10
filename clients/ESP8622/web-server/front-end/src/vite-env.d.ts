/// <reference types="vite/client" />

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
    };
  }
}

export { ScheduleType };
