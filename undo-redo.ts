const generateId = () => {
  return Math.random().toString(36).substring(2);
};

type Layer = {
  id: string;
  name: string;
  data: string | null;
};

type State = {
  layers: Layer[];
};

type DataChange = (dataRef: { data: string }) => void;
type DataCheckpoint = { data: string };
type ActionData =
  | {
      type: "changes";
      changes: DataChange[];
    }
  | {
      type: "checkpoint";
      checkpoint: DataCheckpoint;
    };

type Action = {
  display: string;
  execute: () => Promise<void>;
  undo: () => Promise<void>;
  data: ActionData;
};

type ActionContext = {
  getState: () => State;
  replacePreviousActions: () => Promise<void>;
};

const state: State = {
  layers: [
    {
      id: generateId(),
      name: "Layer 1",
      data: null,
    },
  ],
};

const addLayer = (
  context: ActionContext,
  name: string,
  data?: string
): Action => {
  const state = context.getState();
  const newLayerData = data || "";
  const newLayer: Layer = {
    id: generateId(),
    name,
    data: newLayerData,
  };
  return {
    display: "Add Layer",
    execute: async () => {
      state.layers.push(newLayer);
    },
    undo: async () => {
      state.layers = state.layers.filter((layer) => layer.id !== newLayer.id);
    },
    data: { type: "checkpoint", checkpoint: { data: newLayerData } },
  };
};

const removeLayer = (context: ActionContext, id: string) => {
  const state = context.getState();
  const layer = state.layers.find((layer) => layer.id === id);

  if (!layer) {
    throw new Error("Layer not found");
  }

  return {
    display: "Remove Layer",
    execute: async () => {
      state.layers = state.layers.filter((layer) => layer.id !== id);
    },
    undo: async () => {
      state.layers.push(layer);
    },
  };
};

const drawLayer = (context: ActionContext, layerId: string, data: string) => {
  const state = context.getState();
  const layer = state.layers.find((layer) => layer.id === layerId);

  if (!layer) {
    throw new Error("Layer not found");
  }

  const previousData = layer.data;

  return {
    display: "Draw Layer",
    execute: async () => {
      layer.data = data;
    },
    undo: async () => {
      layer.data = previousData;
    },
  };
};

const applyChanges = (dataRef: { data: string }, chunks: DataChange[]) => {
  // biome-ignore lint/complexity/noForEach: <explanation>
  chunks.forEach((chunk) => {
    console.log("before", dataRef.data);
    chunk(dataRef);
    console.log("after", dataRef.data);
  });
};

const drawChanges = (
  context: ActionContext,
  layerId: string,
  changes: DataChange[]
) => {
  const state = context.getState();
  const layer = state.layers.find((layer) => layer.id === layerId);

  if (!layer) {
    throw new Error("Layer not found");
  }

  return {
    display: "Draw Layer",
    execute: async () => {
      const dataRef = { data: layer.data || "" };
      applyChanges(dataRef, changes);
      layer.data = dataRef.data;
    },
    undo: async () => {
      await context.replacePreviousActions();
      // const dataRef = { data: layer.data || "" };
      // applyChanges(dataRef, changes.reverse());
      // layer.data = dataRef.data;
    },
    getCheckpoint() {
      return null;
    },
  };
};

console.log("Start");
console.log("Initial State", state);

const history: Action[] = [];
let historyCursor = 0;

const createContext = () => {
  const replacePreviousActions = async () => {
    const actions = history.slice(0, historyCursor);
    for (let i = actions.length - 1; i >= 0; i--) {
      // await actions[i].undo();
    }
  };

  return {
    getState: () => state,
    replacePreviousActions,
  };
};

const execute = async (action: Action) => {
  await action.execute();
  historyCursor++;
  history.splice(historyCursor);
  history.push(action);
};

const redo = async (action: Action) => {
  await action.execute();
  historyCursor++;
};

const undo = async (action: Action) => {
  await action.undo();
  historyCursor--;
};

const context = {
  getState: () => state,
};
const action1 = drawChanges(context, state.layers[0].id, [
  (dataRef) => {
    dataRef.data = `${dataRef.data}123`;
  },
  (dataRef) => {
    dataRef.data = dataRef.data.replace("1", "2");
  },
]);
action1.execute();
history.push(action1);
console.log("Action 1", state);
const action2 = drawChanges(context, state.layers[0].id, [
  (dataRef) => {
    dataRef.data = `${dataRef.data}456`;
  },
]);
action2.execute();
history.push(action2);
console.log("Action 2", state);
// action1.undo();
// console.log("Action 1 Undo", state);

console.log("Finish");
export {};

