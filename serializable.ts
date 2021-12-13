import { PreventNeverProps } from './prevent-never-props';

type SerializableType = string | number | boolean | null;

export type Serializable<T> = T extends SerializableType
  ? T
  : T extends Function
  ? never
  : T extends object
  ? { [K in keyof T]: Serializable<T[K]> }
  : never;

export type SafeSerializable<T> = T extends SerializableType
  ? T
  : T extends Function
  ? never
  : T extends object
  ? PreventNeverProps<{ [K in keyof T]: Serializable<T[K]> }>
  : never;

type X1 = Serializable<{ name: string; age: number }>; // { name: string; age: number }
type X2 = Serializable<{ name: string; getAge: () => void }>; // { name: string; getAge: never }
type X3 = SafeSerializable<{ name: string; age: number }>; // { name: string; age: number }
type X4 = SafeSerializable<{ name: string; getAge: () => void }>; // never
