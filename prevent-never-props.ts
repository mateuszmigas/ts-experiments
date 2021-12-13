import { FilterByTypeKeys } from './filter-by-type-keys';

export type PreventNeverProps<T> = FilterByTypeKeys<T, never> extends never
  ? T
  : never;
