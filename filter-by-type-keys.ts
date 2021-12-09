export type FilterByTypeKeys<T, X> = {
  [P in keyof T]: T[P] extends X ? P : never;
}[keyof T];

type User = {
  name: string;
  age: number;
  admin: boolean;
  city: string;
};

type X1 = FilterByTypeKeys<User, string>; // "name" | "city"
type X2 = FilterByTypeKeys<User, string | number>; // "name" | "age" | "city"
