export type Serializable<T> = T extends string | number | boolean | null
  ? T
  : T extends Function
  ? never
  : T extends object
  ? { [K in keyof T]: Serializable<T[K]> }
  : never;

type X1 = Serializable<{ name: string; age: number }>; // { name: string; age: number }
type X2 = Serializable<{ name: string; getAge: () => number }>; // { name: string; getAge: never }
const x1: X1 = { name: 'John', age: 30 }; //ok
const x2: X2 = { name: 'John' }; //not ok
