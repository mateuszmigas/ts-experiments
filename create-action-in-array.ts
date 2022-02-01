const createAction = <T extends string>(
  type: T
): (<P>() => { type: T; payload: P }) =>
  ({ type, payload: undefined } as never);

const actions = [
  createAction('ADD_TODO')<{ id: string; name: string }>(),
  createAction('REMOVE_TODO')<{ id: string }>(),
  createAction('CHANGE_TODO_NAME')<{ id: string; name: string }>(),
] as const;

export type Actions = typeof actions[number];
export const actionTypes = actions.map(action => action.type);
