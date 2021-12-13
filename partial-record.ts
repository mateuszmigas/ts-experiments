export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};

type EventNames = 'NameChanged' | 'AgeChanged' | 'AddressChanged';
type PartialEvent = PartialRecord<EventNames, number>;
const x: PartialEvent = {
  NameChanged: 2,
  AgeChanged: 3,
}; //ok
