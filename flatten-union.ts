export type Events =
  | {
      meta: { name: 'NameChanged' };
      payload: { id: string; name: string };
    }
  | {
      meta: { name: 'AgeChanged' };
      payload: { id: string; age: number };
    }
  | {
      meta: { name: 'CityChanged' };
      payload: { id: string; city: string };
    };

type ExtractEventType<U extends Events> = U['meta']['name'];
type EventTypeWithPayload<U extends Events> = U extends unknown
  ? { type: ExtractEventType<U> } & U
  : never;

const mapToEventWithType = (event: Events) =>
  ({
    type: event.meta.name,
    ...event,
  } as EventTypeWithPayload<Events>);

const handle = (event: Events) => {
  const mappedEvent = mapToEventWithType(event);

  switch (mappedEvent.type) {
    case 'NameChanged': {
      const x = mappedEvent.payload.name; //ok
      break;
    }
    case 'AgeChanged': {
      const x = mappedEvent.payload.age; //ok
      break;
    }
  }
};
