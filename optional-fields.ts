export type OptionalFields<T, K extends keyof T> = Pick<Partial<T>, K> &
  Omit<T, K>;

type User = {
  name: string;
  age: number;
  city: string;
};

type X1 = OptionalFields<User, 'age' | 'city'>;
const x1: X1 = { name: 'Zdzicho' };
