type SideEffect =
  | {
      type: "OPEN_TAB";
      payload: {
        id: string;
        name: string;
      };
    }
  | {
      type: "CLOSE_TAB";
      payload: {
        id: string;
      };
    };

type SideEffectType = SideEffect["type"];
type SideEffectPayload<T extends SideEffectType> = Extract<
  SideEffect,
  { type: T }
>["payload"];

class SideEffectQueue {
  private effects: SideEffect[] = [];
  private subscribers: ((effect: SideEffect) => void)[] = [];

  enqueue<T extends SideEffectType>(type: T, payload: SideEffectPayload<T>) {
    const effect = { type, payload } as SideEffect;
    this.effects.push(effect);
    this.subscribers.forEach((callback) => callback(effect));
  }

  pop<T extends SideEffectType>(
    type: T,
    predicate?: (payload: SideEffectPayload<T>) => boolean
  ): SideEffectPayload<T> | null {
    const effect = this.effects.find(
      (effect) =>
        effect.type === type &&
        (!predicate || predicate(effect.payload as SideEffectPayload<T>))
    );

    if (effect) {
      this.effects = this.effects.filter((e) => e !== effect);
    }

    return effect?.payload as SideEffectPayload<T> | null;
  }

  subscribe(callback: (effect: SideEffect) => void) {
    this.subscribers.push(callback);

    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }
}

const useSideEffect = <T extends SideEffectType>(
  type: T,
  callback: (payload: SideEffectPayload<T>) => void
) => {};

const sideEffectQueue = new SideEffectQueue();
sideEffectQueue.enqueue("OPEN_TAB", {
  id: "home",
  name: "Home",
});

sideEffectQueue.subscribe((effect) => {
  if (effect.type === "OPEN_TAB") {
    console.log(effect.payload.name);
  }
});

const effect1 = sideEffectQueue.pop(
  "OPEN_TAB",
  (payload) => payload.id === "home"
);

const effect2 = sideEffectQueue.pop("OPEN_TAB");

useSideEffect("OPEN_TAB", (payload) => console.log(payload.name));
