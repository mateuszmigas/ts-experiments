import { ValueOf } from './value-of';

export type ObjectPropsToUnion<T> = ValueOf<{
  [P in keyof T]: { name: P; value: T[P] };
}>;

type User = {
  name: string;
  age: number;
  city: string;
};

type UserFields = ObjectPropsToUnion<User>; // { name: "name"; value: string; } | { name: "age"; value: number; } | { name: "city"; value: string; }
