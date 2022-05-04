type SafeOmit<T, K extends keyof T> = Omit<T, K>;

type User = {
  name: string;
  age: number;
  admin: boolean;
  city: string;
};

type X1 = SafeOmit<User, 'admin' | 'city'>; // "name" | "age"
type X2 = SafeOmit<User, 'admin' | 'not-existing'>; // does not compile
