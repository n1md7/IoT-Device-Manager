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
  startTime: Date;
  endTime: Date;
  weekdays: number[];
  enabled: boolean;
};

declare global {
  interface Window {
    scheduler: {
      formatNumber: (n: number) => string;
      formatTime: (n: Date) => string;
      createCard(options: ScheduleType): {
        container: HTMLElement;
        weekdays: NodeListOf<HTMLElement>;
        startTime: HTMLTimeElement;
        endTime: HTMLTimeElement;
        enabled: HTMLSelectElement;
      };
      deserialize(card: ScheduleType): Deserialized;
      serialize(card: Deserialized): ScheduleType;
      fetchSchedules(): Promise<ScheduleType[]>;
      updateSchedule(payload: ScheduleType): Promise<void>;
    };
  }
}

export { ScheduleType };
