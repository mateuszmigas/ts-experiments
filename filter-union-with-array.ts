type EventNames = 'NameChanged' | 'AgeChanged' | 'AddressChanged';

const addEvent = <T extends EventNames>(name: T) => name;

export const filteredEvents = [
  addEvent('NameChanged'),
  addEvent('AddressChanged'),
] as const;

export type FilteredEventNames = typeof filteredEvents[number];
