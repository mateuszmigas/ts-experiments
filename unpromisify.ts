export type UnPromisify<T> = T extends Promise<infer U> ? U : T;

type PromiseOrNot = Promise<string> | number;
type Result = UnPromisify<PromiseOrNot>; // string | number
