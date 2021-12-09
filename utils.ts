export type ValueOf<T> = T[keyof T];

export type FilterByTypeKeys<T, X> = {
  [P in keyof T]: T[P] extends X ? P : never;
}[keyof T];

export type FilterByType<T, X> = Pick<T, FilterByTypeKeys<T, X>>;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
