import { ValueOf } from './value-of';

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
};

const state: State = {
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
    (state, payload: { name: string; path: string }) => {
      return {
        ...state,
        tabs: [...state.tabs, { name: payload.name, path: payload.path }],
      };
    },
    { public: true }
  ),
  'panel.tabs.rename': addAction(
    tabSelectorByIndex,
    (state, payload: { newName: string }) => {
      return {
        ...state,
        name: payload.newName,
      };
    }
  ),
} as const;

export type ActionName = keyof typeof actions;
export type ActionType = ValueOf<{
  [P in keyof typeof actions]: {
    type: P;
    payload: Parameters<typeof actions[P]['sliceSelector']>[1] &
      Parameters<typeof actions[P]['sliceReducer']>[1];
  };
}>;

const executeAction = (action: ActionType) => {
  const { type, payload } = action;
  const { sliceSelector, sliceReducer } = actions[type];
  const slice = sliceSelector(state, payload as never);
  const newState = { ...state };
  Object.assign(slice, sliceReducer(slice as never, payload as never));
  return newState;
};

executeAction({
  type: 'panel.tabs.add',
  payload: {
    panelLocation: 'left',
    name: 'New Tab',
    path: '/users/documents',
  },
});

executeAction({
  type: 'panel.tabs.rename',
  payload: {
    panelLocation: 'left',
    tabIndex: 1,
    newName: 'New Tab Name',
  },
});
