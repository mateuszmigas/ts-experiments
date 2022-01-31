export type UserFields = 'name' | 'age' | 'city';

export type UnionToObjectProps<T extends string, V> = {
  [K in T]: V;
};

export type User = UnionToObjectProps<UserFields, string>; // { name: string; age: number; city: string; }
