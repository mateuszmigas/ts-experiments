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

const createProxyClient = <T extends {}>(
  resolver: (method: string, args: any[]) => Promise<any>
) => {
  const client = {
    someExtraClientMethod() {
      console.log("extra client method");
    },
  };
  const handler = {
    get(target, prop, receiver) {
      if (client.hasOwnProperty(prop)) {
        return client[prop];
      }
      return (...args: any[]) => resolver(prop, args);
    },
  };

  return new Proxy(client, handler) as ProxyClient<T> & typeof client;
};

//http/soap/etc resolver
const resolver = (method: string, args: any[]): Promise<any> => {
  return api[method](...args);
};

const client = createProxyClient<ServerApi>(resolver);
client.someExtraClientMethod();
console.log("client gets user: ", await client.getUser(12));
client.updateUser({ id: 1, name: "John" });
