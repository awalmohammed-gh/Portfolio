/*
 * Declarative form definitions. Forms are described as plain data so the
 * same renderer (SchemaForm) handles projects, services, page content and
 * settings. Field names are paths into the record ("hero.heading.lead").
 */

export type Option = { value: string; label: string };

type Base = {
  name: string;
  label: string;
  help?: string;
  required?: boolean;
  placeholder?: string;
  /** "half" fields sit side by side on wider screens. */
  span?: "full" | "half";
};

export type FieldConfig =
  | (Base & { type: "text" | "url" | "email"; maxLength?: number })
  | (Base & { type: "number"; min?: number; max?: number })
  | (Base & { type: "textarea"; rows?: number; maxLength?: number })
  | (Base & { type: "select"; options?: Option[]; optionsKey?: string })
  | (Base & { type: "switch"; description?: string })
  | (Base & { type: "icon" })
  | (Base & { type: "image" })
  | (Base & { type: "gallery"; max?: number })
  | (Base & { type: "tags"; suggestionsKey?: string })
  | (Base & { type: "list"; rows?: number; itemLabel?: string; max?: number })
  | (Base & { type: "group"; fields: FieldConfig[] })
  | (Base & { type: "repeater"; fields: FieldConfig[]; itemLabel: string; titleField?: string; max?: number })
  | { type: "section"; name: string; label: string; help?: string };

/** Options and suggestions supplied by the server (e.g. skill categories). */
export type DynamicOptions = Record<string, Option[]>;

export type FormValues = Record<string, unknown>;
export type FieldErrors = Record<string, string>;

export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    return (value as Record<string, unknown>)[key];
  }, source);
}

export function setPath<T>(source: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const container: Record<string, unknown> | unknown[] = Array.isArray(source)
    ? [...source]
    : { ...(source as Record<string, unknown>) };
  const current = (container as Record<string, unknown>)[head];
  (container as Record<string, unknown>)[head] =
    rest.length === 0 ? value : setPath(current ?? (/^\d+$/.test(rest[0]) ? [] : {}), rest.join("."), value);
  return container as T;
}

export function join(parent: string, name: string): string {
  return parent ? `${parent}.${name}` : name;
}
