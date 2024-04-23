type Size = { width: number; height: number };

type DynamicField =
  | {
      type: "string";
      name: string;
      defaultValue: string;
    }
  | {
      type: "option-size";
      name: string;
      options: { value: Size; label: string }[];
      defaultValue: Size;
    }
  | {
      type: "option-string";
      name: string;
      options: { value: string; label: string }[];
      defaultValue: string;
    };

const imageFieldsSchema = {
  size: {
    type: "option-size",
    name: "Size",
    options: [
      { value: { width: 100, height: 100 }, label: "small" },
      { value: { width: 200, height: 200 }, label: "medium" },
      { value: { width: 300, height: 300 }, label: "large" },
    ],
    defaultValue: { width: 200, height: 200 },
  },
  url: {
    type: "string",
    name: "URL",
    defaultValue: "https://example.com/image.jpg",
  },
  alt: {
    type: "string",
    name: "Alt",
    defaultValue: "",
  },
} satisfies Record<string, DynamicField>;

type SchemaValues<T extends Record<string, DynamicField>> = {
  [K in keyof T]: T[K]["defaultValue"];
};

export const getDefaultValues = (schema: Record<string, DynamicField>) => {
  return Object.entries(schema).reduce((acc, [key, value]) => {
    acc[key] = value.defaultValue;
    return acc;
  }, {} as Record<string, unknown>);
};

const defaultValues = getDefaultValues(imageFieldsSchema);
defaultValues.size = { width: 300, height: 300 };
defaultValues.url = "https://example.com/image2.jpg";

type ImageSchemaValues = SchemaValues<typeof imageFieldsSchema>;
const mapped = defaultValues as ImageSchemaValues;
console.log(mapped);

