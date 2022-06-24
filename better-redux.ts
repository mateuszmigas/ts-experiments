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

//Selectors
const panelSelector = (
  state: State,
  params: {
    panelLocation: PanelLocation;
  }
) => {
  const { panelLocation } = params;
  return state[`${panelLocation}Panel`];
};

const tabSelectorByIndex = (
  state: State,
  params: {
    panelLocation: PanelLocation;
    tabIndex: number;
  }
) => {
  const { panelLocation, tabIndex } = params;
  return panelSelector(state, { panelLocation }).tabs[tabIndex];
};

//Actions
const addAction = <TSliceState extends object, TParams, TPayload>(
  sliceSelector: (state: State, selectorParams: TParams) => TSliceState,
  sliceReducer: (state: TSliceState, payload: TPayload) => TSliceState,
  meta?: { public: boolean }
) => {
  return {
    sliceSelector,
    sliceReducer,
    meta,
  };
};

const actions = {
  'panel.tabs.add': addAction(
    panelSelector,
    (slice, payload: { name: string; path: string }) => {
      return {
        ...slice,
        tabs: [...slice.tabs, { name: payload.name, path: payload.path }],
      };
    },
    { public: true }
  ),
  'panel.tabs.rename': addAction(
    tabSelectorByIndex,
    (slice, payload: { newName: string }) => {
      return {
        ...slice,
        name: payload.newName,
      };
    }
  ),
  'commandPalette.show': addAction(
    state => state.commandPalette,
    slice => {
      return {
        ...slice,
        isOpen: true,
      };
    }
  ),
} as const;

export type ActionName = keyof typeof actions;
export type ActionPayload<T extends ActionName> = Parameters<
  typeof actions[T]['sliceSelector']
>[1] &
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

const mainReducer = (state: State, action: ActionType) => {
  const { type, payload } = action as { type: ActionName; payload: never };
  const { sliceSelector, sliceReducer } = actions[type];
  const slice = sliceSelector(state, payload);
  const newState = { ...state };
  Object.assign(slice, sliceReducer(slice as never, payload));
  return newState;
};

const dispatch = (action: ActionType) => {
  //call redux dispatch
  state = mainReducer(state, action);
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
