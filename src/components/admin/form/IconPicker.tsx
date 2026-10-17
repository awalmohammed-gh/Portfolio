"use client";

import { createElement, useEffect, useRef, useState } from "react";
import { LuChevronDown, LuSearch, LuX } from "react-icons/lu";
import { getIcon, iconGroups } from "@/lib/icons";
import { buttonClass, inputClass } from "./styles";

const groups = Object.entries(iconGroups) as [string, Record<string, unknown>][];

/** Searchable grid of the icons content can reference by name. */
export default function IconPicker({
  value,
  onChange,
  id,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState(groups[0][0]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const q = query.trim().toLowerCase();
  const names = q
    ? groups.flatMap(([, icons]) => Object.keys(icons)).filter((name, i, all) => all.indexOf(name) === i && name.toLowerCase().includes(q))
    : Object.keys(iconGroups[group as keyof typeof iconGroups]);

  function choose(name: string) {
    onChange(name);
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        className={`${inputClass} flex items-center gap-3 text-left ${invalid ? "border-danger" : ""}`}
      >
        <span className="grid size-7 place-items-center rounded-lg bg-accent-soft text-accent">
          {createElement(getIcon(value), { "aria-hidden": true, className: "size-4" })}
        </span>
        <span className="flex-1 truncate font-mono text-sm">{value || "Choose an icon"}</span>
        <LuChevronDown aria-hidden="true" className="size-4 text-subtle" />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
        aria-label="Choose an icon"
        className="m-auto h-[min(36rem,calc(100dvh-2rem))] w-[min(40rem,calc(100vw-2rem))] rounded-3xl border border-line bg-surface p-0 text-fg shadow-card backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-line p-4">
              <label className="relative flex-1">
                <span className="sr-only">Search icons</span>
                <LuSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
                <input
                  type="search"
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search, e.g. react, database, github"
                  className={`${inputClass} pl-10`}
                />
              </label>
              <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass.icon} aria-label="Close">
                <LuX aria-hidden="true" className="size-4" />
              </button>
            </div>
            {!q && (
              <div role="tablist" aria-label="Icon groups" className="flex gap-1 border-b border-line px-4 py-2">
                {groups.map(([name]) => (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={group === name}
                    onClick={() => setGroup(name)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      group === name ? "bg-accent-soft text-accent" : "text-muted hover:text-fg"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
            <ul className="grid flex-1 grid-cols-4 content-start gap-2 overflow-y-auto p-4 sm:grid-cols-6">
              {names.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => choose(name)}
                    title={name}
                    aria-pressed={value === name}
                    className={`flex w-full flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition ${
                      value === name ? "border-accent bg-accent-soft text-accent" : "border-line hover:border-line-strong"
                    }`}
                  >
                    {createElement(getIcon(name), { "aria-hidden": true, className: "size-5" })}
                    <span className="w-full truncate font-mono text-[0.65rem] text-muted">{name.replace(/^(Fa|Si|Lu|Tb|Vsc)/, "")}</span>
                  </button>
                </li>
              ))}
              {names.length === 0 && <li className="col-span-full py-8 text-center text-sm text-muted">No icons match “{query}”.</li>}
            </ul>
          </div>
        )}
      </dialog>
    </>
  );
}
