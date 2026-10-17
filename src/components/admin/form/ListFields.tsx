"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { LuArrowDown, LuArrowUp, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import type { Option } from "./types";
import { buttonClass, inputClass } from "./styles";

/** Short values as removable chips (technologies, keywords). Enter or comma adds. */
export function TagsInput({
  id,
  value,
  onChange,
  placeholder,
  suggestions = [],
  invalid,
}: {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  suggestions?: Option[];
  invalid?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const listId = useId();
  const tags = value ?? [];

  function add(raw: string) {
    const parts = raw.split(",").map((part) => part.trim()).filter(Boolean);
    const next = [...tags];
    for (const part of parts) if (!next.some((tag) => tag.toLowerCase() === part.toLowerCase())) next.push(part);
    onChange(next);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (draft.trim()) add(draft);
    } else if (event.key === "Backspace" && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      className={`${inputClass} flex min-h-11 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/20`}
      aria-invalid={invalid || undefined}
    >
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className="inline-flex items-center gap-1 rounded-lg bg-accent-soft py-1 pr-1 pl-2.5 text-sm text-accent">
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((_, i) => i !== index))}
            className="grid size-5 place-items-center rounded-md hover:bg-accent/15"
            aria-label={`Remove ${tag}`}
          >
            <LuX aria-hidden="true" className="size-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        list={suggestions.length > 0 ? listId : undefined}
        onChange={(event) => {
          const next = event.target.value;
          // Picking a datalist suggestion fills the input; add it right away.
          if (suggestions.some((s) => s.value === next)) add(next);
          else setDraft(next);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => draft.trim() && add(draft)}
        placeholder={tags.length === 0 ? placeholder ?? "Type and press Enter" : ""}
        className="min-w-32 flex-1 bg-transparent py-1 text-[0.95rem] outline-none placeholder:text-subtle"
      />
      {suggestions.length > 0 && (
        <datalist id={listId}>
          {suggestions
            .filter((s) => !tags.includes(s.value))
            .map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
        </datalist>
      )}
    </div>
  );
}

/** Ordered list of longer text items (paragraphs, responsibilities). */
export function ListEditor({
  id,
  value,
  onChange,
  rows = 1,
  itemLabel = "Item",
  max = 20,
}: {
  id?: string;
  value: string[];
  onChange: (value: string[]) => void;
  rows?: number;
  itemLabel?: string;
  max?: number;
}) {
  const items = value ?? [];

  function update(index: number, text: string) {
    onChange(items.map((item, i) => (i === index ? text : item)));
  }
  function move(index: number, delta: number) {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {rows > 1 ? (
            <textarea
              id={index === 0 ? id : undefined}
              aria-label={`${itemLabel} ${index + 1}`}
              value={item}
              rows={rows}
              onChange={(event) => update(index, event.target.value)}
              className={`${inputClass} resize-y leading-6`}
            />
          ) : (
            <input
              id={index === 0 ? id : undefined}
              aria-label={`${itemLabel} ${index + 1}`}
              value={item}
              onChange={(event) => update(index, event.target.value)}
              className={inputClass}
            />
          )}
          <div className="flex shrink-0 flex-col gap-0.5 sm:flex-row">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className={buttonClass.icon} aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} up`}>
              <LuArrowUp aria-hidden="true" className="size-4" />
            </button>
            <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} className={buttonClass.icon} aria-label={`Move ${itemLabel.toLowerCase()} ${index + 1} down`}>
              <LuArrowDown aria-hidden="true" className="size-4" />
            </button>
            <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className={`${buttonClass.icon} hover:text-danger`} aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}>
              <LuTrash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} disabled={items.length >= max} className={buttonClass.ghost}>
        <LuPlus aria-hidden="true" className="size-4" />
        Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
