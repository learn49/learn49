export type Primitive = string | number | boolean | bigint;

export type JSONValue = Primitive | Array<JSONObject | Primitive> | JSONObject;

export type JSONObject = { [key: string]: JSONValue };
