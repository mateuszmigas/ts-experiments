type UnionDifference<T1, T2> = Exclude<T1, T2> | Exclude<T2, T1>;
const ensureNever = <T extends never>() => {};

export type Actions =
  | { type: 'ADD_TODO'; payload: { id: string; name: string } }
  | { type: 'REMOVE_TODO'; payload: { id: string } }
  | { type: 'CHANGE_TODO_NAME'; payload: { id: string; name: string } };

export const actionTypes = [
  'ADD_TODO',
  'REMOVE_TODO',
  'CHANGE_TODO_NAME',
] as const;

ensureNever<UnionDifference<Actions['type'], typeof actionTypes[number]>>(); //will not compile if they differ
