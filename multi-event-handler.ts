export type Events =
  | {
      name: 'NameChanged';
      payload: { id: string; name: string };
    }
  | {
      name: 'AgeChanged';
      payload: { id: string; age: number };
    }
  | {
      name: 'CityChanged';
      payload: { id: string; city: string };
    };

type EventNames = Events['name'];

const handleEvent = <T extends EventNames[]>(
  name: T,
  handler: (payload: Extract<Events, { name: T[number] }>['payload']) => void
) => {};

handleEvent(['AgeChanged', 'CityChanged'], payload => {});
