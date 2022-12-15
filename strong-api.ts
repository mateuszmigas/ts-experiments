type User = { id: number; name: string };

export const api = {
  getUser: (id: number): Promise<User> => {
    console.log("server getting user", id);
    return Promise.resolve({ id, name: "John" });
  },
  updateUser: (user: User): Promise<void> => {
    console.log("server updating user", user);
    return Promise.resolve();
  },
};

type ServerApi = typeof api;

type ProxyClient<T extends Record<string | symbol | number, any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? T[K] : never;
};

const createProxyClient = <T extends {}>() => {
  const client = {
    someExtraClientMethod() {
      console.log("extra method");
    },
  };
  const handler = {
    get(target, prop, receiver) {
      if (client.hasOwnProperty(prop)) {
        return client[prop];
      }

      return (...args: any[]) => {
        //todo: calling server logic, rest/soap, etc
        return api[prop](...args);
      };
    },
  };

  return new Proxy(client, handler) as ProxyClient<T> & typeof client;
};

const client = createProxyClient<ServerApi>();
client.someExtraClientMethod();
console.log("client gets user: ", await client.getUser(12));
client.updateUser({ id: 1, name: "John" });
