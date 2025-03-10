/// <reference types="vite/client" />

type CardOptions = {
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
  startTime: string;
  endTime: string;
  weekdays: number[];
  enabled: boolean;
};

declare global {
  interface Window {
    scheduler: {
      createCard(options: CardOptions): {
        container: HTMLElement;
        weekdays: NodeListOf<HTMLElement>;
        startTime: Type;
        endTime: HTMLInputElement;
        enabled: HTMLSelectElement;
      };
      deserialize(card: CardOptions): Deserialized;
      serialize(card: Deserialized): CardOptions;
      fetchSchedules(): Promise<CardOptions[]>;
    };
  }
}

export { CardOptions };
