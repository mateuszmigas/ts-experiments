export type ValueOf<T> = T[keyof T];

type User = {
  name: string;
  age: number;
};

type Props = ValueOf<User>; //string | number
