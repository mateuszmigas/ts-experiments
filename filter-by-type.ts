import { FilterByTypeKeys } from './filter-by-type-keys';

export type FilterByType<T, X> = Pick<T, FilterByTypeKeys<T, X>>;

type User = {
  name: string;
  age: number;
  city: string;
};

type X1 = FilterByType<User, string>; // { name: string; city: string; }
