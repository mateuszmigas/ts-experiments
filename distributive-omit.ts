export type DistributiveOmit<T, K extends string> = T extends unknown
  ? Omit<T, K>
  : never;

export type Events =
  | {
      name: 'NameChanged';
      id: string;
      payload: { name: string };
    }
  | {
      name: 'AgeChanged';
      id: string;
    }
  | {
      name: 'CityChanged';
      payload: { city: string };
    };

type EventsWithoutPayloads = DistributiveOmit<Events, 'payload'>;
const x1: EventsWithoutPayloads = { name: 'NameChanged', id: '1' }; //ok
// const x2: EventsWithoutPayloads = { name: 'NameChanged' }; //not ok
