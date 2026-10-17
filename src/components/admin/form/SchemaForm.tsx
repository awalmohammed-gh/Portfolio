"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { LuArrowDown, LuArrowUp, LuCheck, LuCircle, LuLoaderCircle, LuPlus, LuSave, LuTrash2 } from "react-icons/lu";
import type { ImageAsset } from "@/types/media";
import { api, ApiClientError } from "../api-client";
import { useConfirm, useToast } from "../Feedback";
import { useUnsavedChanges } from "../NavigationGuard";
import GalleryField from "./GalleryField";
import IconPicker from "./IconPicker";
import ImageField from "./ImageField";
import { ListEditor, TagsInput } from "./ListFields";
import { buttonClass, errorClass, helpClass, inputClass, labelClass } from "./styles";
import {
  getPath,
  join,
  setPath,
  type DynamicOptions,
  type FieldConfig,
  type FieldErrors,
  type FormValues,
} from "./types";

const fieldId = (path: string) => `field-${path.replace(/\./g, "-")}`;

type RendererProps = {
  fields: FieldConfig[];
  values: FormValues;
  errors: FieldErrors;
  options: DynamicOptions;
  parent: string;
  onChange: (path: string, value: unknown) => void;
};

function Fields({ fields, values, errors, options, parent, onChange }: RendererProps) {
  return (
    <div className="admin-fields-grid">
      {fields.map((field) => {
        if (field.type === "section") {
          return (
            <div key={field.name} className="admin-field-full border-t border-line pt-6 first:border-0 first:pt-0">
              <h3 className="text-base font-semibold tracking-tight text-fg">{field.label}</h3>
              {field.help && <p className="mt-1 text-sm text-muted">{field.help}</p>}
            </div>
          );
        }
        const path = join(parent, field.name);
        return (
          <div key={path} className={field.span === "half" ? "" : "admin-field-full"}>
            <Field field={field} path={path} values={values} errors={errors} options={options} onChange={onChange} />
          </div>
        );
      })}
    </div>
  );
}

function Field({
  field,
  path,
  values,
  errors,
  options,
  onChange,
}: {
  field: Exclude<FieldConfig, { type: "section" }>;
  path: string;
  values: FormValues;
  errors: FieldErrors;
  options: DynamicOptions;
  onChange: (path: string, value: unknown) => void;
}) {
  const id = fieldId(path);
  const value = getPath(values, path);
  const error = errors[path];
  const describedBy = [field.help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const common = { id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy };
  const set = (next: unknown) => onChange(path, next);

  let control: ReactNode;
  switch (field.type) {
    case "text":
    case "url":
    case "email":
      control = (
        <input
          {...common}
          type={field.type}
          value={(value as string) ?? ""}
          required={field.required}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(event) => set(event.target.value)}
          className={inputClass}
        />
      );
      break;
    case "number":
      control = (
        <input
          {...common}
          type="number"
          inputMode="numeric"
          value={value === null || value === undefined ? "" : String(value)}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          onChange={(event) => set(event.target.value === "" ? null : Number(event.target.value))}
          className={inputClass}
        />
      );
      break;
    case "textarea":
      control = (
        <textarea
          {...common}
          value={(value as string) ?? ""}
          rows={field.rows ?? 4}
          required={field.required}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          onChange={(event) => set(event.target.value)}
          className={`${inputClass} resize-y leading-6`}
        />
      );
      break;
    case "select": {
      const choices = field.options ?? (field.optionsKey ? options[field.optionsKey] : undefined) ?? [];
      control = (
        <>
        <select {...common} value={(value as string) ?? ""} required={field.required} onChange={(event) => set(event.target.value)} className={inputClass}>
          {!field.required && <option value="">—</option>}
          {field.required && !value && <option value="">Select…</option>}
          {choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
        {field.optionsKey === "categories" && choices.length === 0 && <p className="mt-2 text-xs leading-5 text-muted">Create a category before adding a skill. <Link href="/admin/skills/categories/new" className="font-medium text-accent hover:underline">Add a category</Link></p>}
        </>
      );
      break;
    }
    case "switch":
      return (
        <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-line bg-surface-2/50 p-4">
          <span>
            <span className={labelClass}>{field.label}</span>
            {(field.description || field.help) && <span className="mt-0.5 block text-sm text-muted">{field.description ?? field.help}</span>}
          </span>
          <span className="relative inline-flex shrink-0 items-center">
            <input id={id} type="checkbox" role="switch" checked={Boolean(value)} onChange={(event) => set(event.target.checked)} className="peer sr-only" />
            <span className="h-6 w-11 rounded-full bg-line-strong/50 transition peer-checked:bg-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/30" />
            <span className="absolute left-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
          </span>
        </label>
      );
    case "icon":
      control = <IconPicker id={id} value={(value as string) ?? ""} onChange={set} invalid={Boolean(error)} />;
      break;
    case "image":
      control = <ImageField id={id} value={value as ImageAsset | null} onChange={set} invalid={Boolean(error)} describedBy={describedBy} />;
      break;
    case "gallery":
      control = <GalleryField value={(value as ImageAsset[]) ?? []} onChange={set} max={field.max} />;
      break;
    case "tags":
      control = (
        <TagsInput
          id={id}
          value={(value as string[]) ?? []}
          onChange={set}
          placeholder={field.placeholder}
          suggestions={field.suggestionsKey ? options[field.suggestionsKey] : undefined}
          invalid={Boolean(error)}
        />
      );
      break;
    case "list":
      control = <ListEditor id={id} value={(value as string[]) ?? []} onChange={set} rows={field.rows} itemLabel={field.itemLabel} max={field.max} />;
      break;
    case "group":
      return (
        <fieldset className="rounded-2xl border border-line p-4 sm:p-5">
          <legend className="px-1.5 text-sm font-semibold text-fg">{field.label}</legend>
          {field.help && <p className="-mt-1 mb-4 text-sm text-muted">{field.help}</p>}
          <Fields fields={field.fields} values={values} errors={errors} options={options} parent={path} onChange={onChange} />
        </fieldset>
      );
    case "repeater":
      return <Repeater field={field} path={path} values={values} errors={errors} options={options} onChange={onChange} />;
  }

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
      </label>
      <div className="mt-2">{control}</div>
      {field.help && (
        <p id={`${id}-help`} className={helpClass}>
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={errorClass}>
          {error}
        </p>
      )}
    </div>
  );
}

function Repeater({
  field,
  path,
  values,
  errors,
  options,
  onChange,
}: {
  field: Extract<FieldConfig, { type: "repeater" }>;
  path: string;
  values: FormValues;
  errors: FieldErrors;
  options: DynamicOptions;
  onChange: (path: string, value: unknown) => void;
}) {
  const items = (getPath(values, path) as Record<string, unknown>[] | undefined) ?? [];
  const max = field.max ?? 20;

  function move(index: number, delta: number) {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(path, next);
  }

  return (
    <fieldset>
      <legend className={labelClass}>{field.label}</legend>
      {field.help && <p className={helpClass}>{field.help}</p>}
      {errors[path] && <p className={errorClass}>{errors[path]}</p>}
      <ol className="mt-3 space-y-3">
        {items.map((item, index) => {
          const title = field.titleField ? String(item?.[field.titleField] ?? "") : "";
          return (
            <li key={index} className="rounded-2xl border border-line bg-surface-2/40 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-fg">
                  {field.itemLabel} {index + 1}
                  {title && <span className="font-normal text-muted"> · {title}</span>}
                </p>
                <div className="flex shrink-0 gap-0.5">
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={buttonClass.icon} aria-label={`Move ${field.itemLabel.toLowerCase()} ${index + 1} up`}>
                    <LuArrowUp aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className={buttonClass.icon} aria-label={`Move ${field.itemLabel.toLowerCase()} ${index + 1} down`}>
                    <LuArrowDown aria-hidden="true" className="size-4" />
                  </button>
                  <button type="button" onClick={() => onChange(path, items.filter((_, i) => i !== index))} className={`${buttonClass.icon} hover:text-danger`} aria-label={`Remove ${field.itemLabel.toLowerCase()} ${index + 1}`}>
                    <LuTrash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
              <Fields fields={field.fields} values={values} errors={errors} options={options} parent={`${path}.${index}`} onChange={onChange} />
            </li>
          );
        })}
      </ol>
      <button type="button" onClick={() => onChange(path, [...items, emptyItem(field.fields)])} disabled={items.length >= max} className={`${buttonClass.ghost} mt-2`}>
        <LuPlus aria-hidden="true" className="size-4" />
        Add {field.itemLabel.toLowerCase()}
      </button>
    </fieldset>
  );
}

function emptyItem(fields: FieldConfig[]): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === "section") continue;
    if (field.type === "tags" || field.type === "list" || field.type === "gallery" || field.type === "repeater") item[field.name] = [];
    else if (field.type === "switch") item[field.name] = false;
    else if (field.type === "image" || field.type === "number") item[field.name] = null;
    else if (field.type === "group") item[field.name] = emptyItem(field.fields);
    else if (field.type === "icon") item[field.name] = "FaCode";
    else item[field.name] = "";
  }
  return item;
}

export type SubmitVariant = { label: string; patch?: FormValues; primary?: boolean };

/**
 * Renders a form from field definitions and submits it as JSON to our API.
 * Server-side Zod errors come back keyed by field path and show inline.
 */
export default function SchemaForm({
  fields,
  initialValues,
  options = {},
  action,
  variants = [{ label: "Save changes", primary: true }],
  successMessage = "Changes saved.",
  onSaved,
  aside,
}: {
  fields: FieldConfig[];
  initialValues: FormValues;
  options?: DynamicOptions;
  action: { url: string; method: "POST" | "PATCH" };
  variants?: SubmitVariant[];
  successMessage?: string;
  onSaved?: (data: Record<string, unknown>) => void;
  aside?: ReactNode;
}) {
  const toast = useToast();
  const confirm = useConfirm();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [saved, setSaved] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [hasSaved, setHasSaved] = useState(action.method !== "POST");

  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(saved), [values, saved]);

  useUnsavedChanges(dirty);

  const sections = useMemo(() => {
    const result: { name: string; label: string; help?: string; parent: string; fields: FieldConfig[] }[] = [];
    // Page editors made up of groups get one card per group. Keep each group's
    // path so the same field definitions and API validation continue to work.
    const separateGroups = !fields.some((field) => field.type === "section") && fields.filter((field) => field.type === "group").length > 1;
    for (const field of fields) {
      if (separateGroups && field.type === "group") result.push({ name: field.name, label: field.label, help: field.help, parent: field.name, fields: field.fields });
      else if (field.type === "section") result.push({ name: field.name, label: field.label, help: field.help, parent: "", fields: [] });
      else {
        if (!result.length || result[result.length - 1].parent) result.push({ name: `details-${result.length}`, label: "Details", parent: "", fields: [] });
        result[result.length - 1].fields.push(field);
      }
    }
    return result.filter((section) => section.fields.length);
  }, [fields]);

  function onChange(path: string, value: unknown) {
    setValues((current) => setPath(current, path, value));
    if (errors[path]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[path];
        return next;
      });
    }
  }

  async function submit(event: FormEvent<HTMLFormElement> | null, variant: SubmitVariant) {
    event?.preventDefault();
    if (submitting !== null) return;
    if (saved.publishStatus === "published" && variant.patch?.publishStatus === "draft" && !await confirm({
      title: "Move this project to drafts?", message: "It will no longer be visible on your public portfolio. Your content will be kept.", confirmLabel: "Move to drafts",
    })) return;
    setSubmitting(variant.label);
    setFormError("");
    const body = { ...values, ...variant.patch };
    try {
      const { data } = await api<Record<string, unknown>>(action.url, { method: action.method, body });
      const next = { ...body };
      setValues(next);
      setSaved(next);
      setHasSaved(true);
      setErrors({});
      toast.success(body.publishStatus === "draft" ? "Draft saved. Only you can see this project." : body.publishStatus === "published" ? "Project published. Your portfolio is up to date." : body.visible === false ? "Saved. This item is hidden from your portfolio." : successMessage);
      onSaved?.(data);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrors(error.fields);
        setFormError(error.message);
        toast.error(error.message);
        const first = Object.keys(error.fields)[0];
        if (first) {
          requestAnimationFrame(() => {
            const element = document.getElementById(fieldId(first));
            element?.focus();
            element?.scrollIntoView({ block: "center", behavior: "smooth" });
          });
        }
      } else {
        setFormError("Something went wrong. Your edits are still here. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(null);
    }
  }

  const effectiveVariants: SubmitVariant[] = typeof saved.publishStatus === "string" ? saved.publishStatus === "published"
    ? [{ label: "Save changes", patch: { publishStatus: "published" }, primary: true }, { label: "Move to drafts", patch: { publishStatus: "draft" } }]
    : [{ label: "Save draft", patch: { publishStatus: "draft" }, primary: true }, { label: "Publish project", patch: { publishStatus: "published" } }]
    : variants;
  const primary = effectiveVariants.find((v) => v.primary) ?? effectiveVariants[0];
  const status = dirty ? "Unsaved changes" : !hasSaved ? "New record" : saved.publishStatus === "draft" ? "Saved as draft" : saved.publishStatus === "published" ? "Published" : saved.visible === false ? "Saved · hidden" : "Changes saved";
  const statusHelp = dirty ? "Save when you’re ready." : !hasSaved ? "Complete the details to get started." : saved.publishStatus === "draft" ? "Private until you publish." : saved.visible === false ? "Hidden from the public site." : "Your saved version is up to date.";

  return (
    <form onSubmit={(event) => submit(event, primary)} noValidate className="admin-editor">
      <div className="admin-editor-main">
        {sections.length > 1 && <nav aria-label="Editor sections" className="admin-section-nav">{sections.map((section, index) => <a key={section.name} href={`#editor-${section.name}`}><span className="text-subtle">{String(index + 1).padStart(2, "0")}</span>{section.label}</a>)}</nav>}
        {formError && (
          <div role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
            {formError}
          </div>
        )}
        <fieldset disabled={submitting !== null} className="min-w-0">
          <legend className="sr-only">Content details</legend>
          {sections.map((section, index) => <section key={section.name} id={`editor-${section.name}`} aria-labelledby={`heading-${section.name}`} className="admin-panel admin-editor-section">
            <div className="admin-section-heading">
              <div className="flex items-center gap-3"><span className="admin-editor-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h2 id={`heading-${section.name}`} className="text-sm font-semibold text-fg">{section.label}</h2>{section.help && <p className="mt-1 text-xs text-muted">{section.help}</p>}</div></div>
            </div>
            <div className="admin-editor-section-body"><Fields fields={section.fields} values={values} errors={errors} options={options} parent={section.parent} onChange={onChange} /></div>
          </section>)}
        </fieldset>
      </div>

      <aside className="admin-panel admin-editor-actions" aria-label="Save actions">
        <p className="admin-save-heading">{typeof saved.publishStatus === "string" ? "Publishing" : "Save your changes"}</p>
        <div className="admin-editor-action-inner">
          <div role="status"><p className="flex items-center gap-2 text-xs font-semibold text-fg">{dirty || !hasSaved ? <LuCircle aria-hidden="true" className="size-3.5 text-warning" /> : <LuCheck aria-hidden="true" className="size-3.5 text-success" />}{status}</p><p className="mt-1 text-xs leading-5 text-muted">{statusHelp}</p></div>
          <div className="admin-editor-buttons">
            {effectiveVariants.map((variant) => (
              <button
                key={variant.label}
                type={variant === primary ? "submit" : "button"}
                onClick={variant === primary ? undefined : () => submit(null, variant)}
                disabled={submitting !== null}
                className={variant === primary ? buttonClass.primary : buttonClass.secondary}
              >
                {submitting === variant.label ? <LuLoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : variant === primary ? <LuSave aria-hidden="true" className="size-4" /> : null}
                {variant.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
      {aside && <aside className="admin-editor-info">{aside}</aside>}
    </form>
  );
}
