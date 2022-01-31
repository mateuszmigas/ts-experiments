export type UserFields = 'name' | 'age' | 'city';

export type UnionToObjectProps<T extends string> = {
  [K in T]: string;
};

export type User = UnionToObjectProps<UserFields>; // { name: string; age: number; city: string; }
