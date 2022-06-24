export type ValueOf<T> = T[keyof T];

//State
type TabState = {
  path: string;
  name: string;
};

type PanelState = {
  activeTabIndex: number;
  tabs: TabState[];
};

type PanelLocation = 'left' | 'right';

type State = {
  leftPanel: PanelState;
  rightPanel: PanelState;
  activePanel: PanelLocation;
  commandPalette: { isOpen: boolean };
};

let state: State = {
  leftPanel: {
    activeTabIndex: 1,
    tabs: [
      { path: '/', name: 'Home' },
      { path: '/about', name: 'About' },
    ],
  },
  rightPanel: {
    activeTabIndex: 0,
    tabs: [{ path: '/', name: 'Home' }],
  },
  activePanel: 'left',
  commandPalette: { isOpen: false },
};

//Top reducers
const mainReducer = (
  state: State,
  sliceReducer: (slice: State, params: unknown) => State,
  params: unknown
) => {
  return {
    ...sliceReducer(state, params),
  };
};

const panelReducer = (
  state: State,
  sliceReducer: (slice: PanelState, params: unknown) => PanelState,
  params: { panelLocation: PanelLocation }
) => {
  const { panelLocation } = params;
  return {
    ...state,
    [`${panelLocation}Panel`]: sliceReducer(
      state[`${panelLocation}Panel`],
      params
    ),
  };
};

const tabByIndexReducer = (
  state: State,
  sliceReducer: (slice: TabState, params: unknown) => TabState,
  params: {
    panelLocation: PanelLocation;
    tabIndex: number;
  }
) => {
  const { panelLocation, tabIndex } = params;
  return panelReducer(
    state,
    slice => ({
      ...slice,
      tabs: slice.tabs.map((tab, index) => {
        if (index === tabIndex) {
          return sliceReducer(tab, params);
        }
        return tab;
      }),
    }),
    { panelLocation }
  );
};

//Actions
const addAction = <TSliceState extends object, TParams, TPayload>(
  topReducer: (
    state: State,
    sliceReducer: (slice: TSliceState, params: unknown) => TSliceState,
    selectorParams: TParams
  ) => State,
  sliceReducer: (
    sliceState: TSliceState,
    payload: TPayload,
    state: Readonly<State>
  ) => TSliceState,
  meta?: { public: boolean }
) => {
  return {
    topReducer,
    sliceReducer,
    meta,
  };
};

const actions = {
  'panel.tabs.add': addAction(
    panelReducer,
    (slice, payload: { name: string; path: string }) => {
      return {
        ...slice,
        tabs: [...slice.tabs, { name: payload.name, path: payload.path }],
      };
    },
    { public: true }
  ),
  'panel.tabs.rename': addAction(
    tabByIndexReducer,
    (slice, payload: { newName: string }) => {
      return {
        ...slice,
        name: payload.newName,
      };
    }
  ),
  'commandPalette.show': addAction(mainReducer, slice => {
    return {
      ...slice,
      isOpen: true,
    };
  }),
} as const;

export type ActionName = keyof typeof actions;
export type ActionPayload<T extends ActionName> = Parameters<
  typeof actions[T]['topReducer']
>[2] &
  Parameters<typeof actions[T]['sliceReducer']>[1];

export type ActionType = ValueOf<{
  [P in keyof typeof actions]: ActionPayload<P> extends {}
    ? {
        type: P;
        payload: ActionPayload<P>;
      }
    : {
        type: P;
      };
}>;

const reducer = (state: State, action: ActionType) => {
  const { type, payload } = action as { type: ActionName; payload: never };
  const { topReducer, sliceReducer } = actions[type];
  const newState = topReducer(state, sliceReducer as never, payload);
  return newState;
};

const dispatch = (action: ActionType) => {
  //call redux dispatch
  state = reducer(state, action);
};

console.log(JSON.stringify(state));

dispatch({
  type: 'panel.tabs.add',
  payload: {
    panelLocation: 'left',
    name: 'New Tab',
    path: '/users/documents',
  },
});

console.log(JSON.stringify(state));

dispatch({
  type: 'panel.tabs.rename',
  payload: {
    panelLocation: 'left',
    tabIndex: 1,
    newName: 'New Tab Name',
  },
});

console.log(JSON.stringify(state));

dispatch({
  type: 'commandPalette.show',
});

console.log(JSON.stringify(state));
