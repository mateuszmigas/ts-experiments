function typeError(value: unknown, type: string): Error {
  return new Error(`Expected ${value} to be ${type}`);
}

type AssertFn<T> = (value: unknown) => asserts value is T;
type ParseFn<T> = (value: unknown) => T;
type Parser<T> = {
  parse: ParseFn<T>;
};

const schemaBuilder = {
  string: () => {
    function validate(value: unknown): asserts value is string {
      if (typeof value !== "string") typeError(value, "string");
    }
    return {
      parse: (value: unknown): string => {
        validate(value);
        return value;
      },
    };
  },
  number: () => {
    function validate(value: unknown): asserts value is number {
      if (typeof value !== "number") typeError(value, "number");
    }
    return {
      parse: (value: unknown): number => {
        validate(value);
        return value;
      },
    };
  },
  object<T, S extends Record<string, Parser<T>>>(schema: S) {
    function validate(value: unknown): asserts value is {
      [K in keyof S]: ReturnType<S[K]["parse"]>;
    } {
      if (!value) throw typeError(value, "object");
      if (typeof value !== "object") throw typeError(value, "object");
      if (Array.isArray(value)) throw typeError(value, "object");
      for (const k of Object.keys(schema)) {
        if (k in value) {
          schema[k].parse((value as any)[k]);
        } else {
          throw typeError(value, "object");
        }
      }
    }
    return {
      parse(value: unknown) {
        validate(value);
        return value;
      },
    };
  },
};

const schema1 = schemaBuilder.object({
  age: schemaBuilder.number(),
  fullName: schemaBuilder.object({
    first: schemaBuilder.string(),
    last: schemaBuilder.string(),
    moreNested: schemaBuilder.object({
      foo: schemaBuilder.string(),
    }),
  }),
});

const val1 = schema1.parse({
  age: 2,
  fullName: {
    first: "a",
    last: 2,
  },
});

const schema2 = schemaBuilder.string();
const val2 = schema2.parse("foo");
