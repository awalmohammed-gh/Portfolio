"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createElement, useMemo, useState } from "react";
import {
  LuArrowDown,
  LuArrowUp,
  LuEye,
  LuEyeOff,
  LuLayoutGrid,
  LuList,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSearchX,
  LuTrash2,
} from "react-icons/lu";
import { getIcon } from "@/lib/icons";
import { api, ApiClientError } from "./api-client";
import { useConfirm, useToast } from "./Feedback";
import { buttonClass, inputClass } from "./form/styles";
import { getPath, type DynamicOptions } from "./form/types";
import { resources, type Column, type ResourceKey } from "./resources";
import { AdminEmptyState, StatusBadge, formatDate } from "./ui";
import ResourceSummary from "./ResourceSummary";
import ResourceCollection, { type AdminResourceItem } from "./ResourceCollection";

type Item = AdminResourceItem;

export default function ResourceList({
  resource,
  items: initialItems,
  options = {},
  lookups = {},
  reorderScope,
}: {
  resource: ResourceKey;
  items: Item[];
  options?: DynamicOptions;
  /** Maps stored ids to labels for display, e.g. { categoryId: { "<id>": "Frontend" } }. */
  lookups?: Record<string, Record<string, string>>;
  /** A filter key that may stay active while reordering (e.g. skills within a category). */
  reorderScope?: string;
}) {
  const config = resources[resource];
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const params = useSearchParams();

  const [items, setItems] = useState(initialItems);
  const query = params.get("q") ?? "";
  const filters = useMemo(() => Object.fromEntries((config.filters ?? []).map((filter) => [filter.key, params.get(filter.key) ?? ""])), [config, params]);
  const sort = ["updated", "alpha"].includes(params.get("sort") ?? "") ? params.get("sort")! : "order";
  const projectGrid = resource === "projects" && params.get("view") === "grid";
  const [busy, setBusy] = useState<string | null>(null);

  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value && !(key === "sort" && value === "order")) next.set(key, value);
      else next.delete(key);
    }
    window.history.replaceState(null, "", `${window.location.pathname}${next.size ? `?${next}` : ""}`);
  }
  function clearFilters() { updateParams({ q: "", ...Object.fromEntries((config.filters ?? []).map((filter) => [filter.key, ""])) }); }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
      for (const [key, value] of Object.entries(filters)) {
        if (value && String(getPath(item, key)) !== value) return false;
      }
      if (!q) return true;
      return config.searchKeys.some((key) => {
        const value = getPath(item, key);
        return (Array.isArray(value) ? value.join(" ") : String(value ?? "")).toLowerCase().includes(q);
      });
    });
    if (sort === "updated") list = [...list].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    if (sort === "alpha") list = [...list].sort((a, b) => String(a[config.titleKey]).localeCompare(String(b[config.titleKey])));
    return list;
  }, [items, query, filters, sort, config]);

  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const canReorder =
    sort === "order" && !query.trim() && activeFilters.every(([key]) => key === reorderScope)
    && (resource !== "skills" || Boolean(filters.categoryId));

  async function move(index: number, delta: number) {
    if (busy) return;
    setBusy("reorder");
    const reordered = [...visible];
    const [item] = reordered.splice(index, 1);
    reordered.splice(index + delta, 0, item);
    const previous = items;
    // Optimistic: apply new order to the visible subset, keep the rest in place.
    const orderOf = new Map(reordered.map((it, i) => [it.id, i]));
    setItems((list) =>
      [...list]
        .map((it) => (orderOf.has(it.id) ? { ...it, order: orderOf.get(it.id) } : it))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    );
    try {
      await api(`${config.apiPath}/reorder`, { method: "POST", body: { ids: reordered.map((it) => it.id) } });
      router.refresh();
    } catch (error) {
      setItems(previous);
      toast.error(error instanceof ApiClientError ? error.message : "Couldn't save the new order.");
    } finally {
      setBusy(null);
    }
  }

  async function toggle(item: Item) {
    const t = config.toggle!;
    const isOn = getPath(item, t.key) === t.on;
    const nextValue = isOn ? t.off : t.on;
    setBusy(item.id);
    try {
      await api(`${config.apiPath}/${item.id}`, { method: "PATCH", body: { [t.key]: nextValue } });
      setItems((list) => list.map((it) => (it.id === item.id ? { ...it, [t.key]: nextValue, updatedAt: new Date().toISOString() } : it)));
      toast.success(`${String(item[config.titleKey])} is now ${(isOn ? t.offLabel : t.onLabel).toLowerCase()}.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Couldn't update.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(item: Item) {
    const title = String(item[config.titleKey]);
    const ok = await confirm({
      title: `Delete “${title}”?`,
      message: `This permanently removes the ${config.singular.toLowerCase()} from the site. Images it uses are deleted too unless something else uses them.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setBusy(item.id);
    try {
      await api(`${config.apiPath}/${item.id}`, { method: "DELETE" });
      setItems((list) => list.filter((it) => it.id !== item.id));
      toast.success(`Deleted “${title}”.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Couldn't delete.");
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return (
      <AdminEmptyState icon={<LuPlus className="size-5" />} title={`No ${config.plural.toLowerCase()} yet`} description={config.description} action={<Link href={`${config.adminPath}/new`} className={buttonClass.primary}><LuPlus aria-hidden="true" className="size-4" />Add {config.singular.toLowerCase()}</Link>} />
    );
  }

  return (
    <div className="space-y-4">
      <ResourceSummary resource={resource} items={items} />
      {resource === "projects" && <div className="admin-collection-tabs" role="group" aria-label="Filter projects by publishing status">{[{ label: "All projects", value: "" }, { label: "Published", value: "published" }, { label: "Drafts", value: "draft" }].map((tab) => <button key={tab.value} type="button" aria-pressed={(filters.publishStatus ?? "") === tab.value} onClick={() => updateParams({ publishStatus: tab.value })}>{tab.label}<span>{tab.value ? items.filter((item) => item.publishStatus === tab.value).length : items.length}</span></button>)}</div>}
      <div className="admin-toolbar">
        <label className="admin-toolbar-search">
          <span className="admin-filter-label">Search {config.plural.toLowerCase()}</span>
          <span className="relative block"><LuSearch aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={query} onChange={(e) => updateParams({ q: e.target.value })} placeholder={`Find a ${config.singular.toLowerCase()}…`} className={`${inputClass} pl-10`} /></span>
        </label>
        {config.filters?.map((filter) => {
          const choices = filter.options ?? (filter.optionsKey ? options[filter.optionsKey] : []) ?? [];
          return (
            <label key={filter.key} className="admin-toolbar-filter">
              <span className="admin-filter-label">{filter.label}</span>
              <select value={filters[filter.key] ?? ""} onChange={(e) => updateParams({ [filter.key]: e.target.value })} className={inputClass}>
                <option value="">All {filter.label.toLowerCase()}</option>
                {choices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
        <label className="admin-toolbar-filter">
          <span className="admin-filter-label">Sort by</span>
          <select value={sort} onChange={(e) => updateParams({ sort: e.target.value })} className={inputClass}>
            <option value="order">Display order</option>
            <option value="updated">Recently updated</option>
            <option value="alpha">Name A–Z</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1"><p className="text-xs text-muted" aria-live="polite">
        {visible.length} of {items.length} {items.length === 1 ? config.singular.toLowerCase() : config.plural.toLowerCase()}
        {!canReorder && (resource === "skills" && !filters.categoryId ? " · Choose a category to reorder skills" : " · Switch to display order with no search to reorder")}
      </p><div className="flex items-center gap-3">{(query || activeFilters.length > 0) && <button type="button" onClick={clearFilters} className="text-xs font-medium text-accent hover:underline">Clear filters</button>}{resource === "projects" && <div role="group" aria-label="Project view" className="flex rounded-lg border border-line bg-surface p-0.5"><button type="button" aria-label="List view" aria-pressed={!projectGrid} onClick={() => updateParams({ view: "" })} className={`${buttonClass.icon} ${!projectGrid ? "bg-accent-soft text-accent" : ""}`}><LuList aria-hidden="true" className="size-4" /></button><button type="button" aria-label="Grid view" aria-pressed={projectGrid} onClick={() => updateParams({ view: "grid" })} className={`${buttonClass.icon} ${projectGrid ? "bg-accent-soft text-accent" : ""}`}><LuLayoutGrid aria-hidden="true" className="size-4" /></button></div>}</div></div>

      {visible.length === 0 ? (
        <AdminEmptyState icon={<LuSearchX className="size-5" />} title="No matching content" description={`No ${config.plural.toLowerCase()} match these filters.`} action={<button type="button" onClick={clearFilters} className={buttonClass.secondary}>Clear filters</button>} />
      ) : (
        <ResourceCollection resource={resource} items={visible} lookups={lookups} grid={projectGrid} renderItem={(item, index) => {
            const title = String(item[config.titleKey] ?? "Untitled");
            const subtitleRaw = config.subtitleKey ? getPath(item, config.subtitleKey) : "";
            const subtitle = config.subtitleKey && lookups[config.subtitleKey] ? lookups[config.subtitleKey][String(subtitleRaw)] : subtitleRaw;
            const image = config.imageKey ? (getPath(item, config.imageKey) as { url?: string; alt?: string } | null) : null;
            const toggleState = config.toggle ? getPath(item, config.toggle.key) === config.toggle.on : false;
            return (
              <li key={item.id} className="admin-resource-row">
                {projectGrid && <div className="admin-project-thumbnail">{image?.url ? <Image src={image.url} alt={image.alt ?? ""} fill sizes="(min-width: 1280px) 420px, (min-width: 768px) 45vw, 90vw" className="object-cover" /> : <span className="grid h-full place-items-center text-accent">{createElement(getIcon(String(item.icon ?? "FaCode")), { "aria-hidden": true, className: "size-8" })}</span>}</div>}
                <div className="admin-resource-identity">
                {canReorder && (
                  <div className="admin-reorder">
                    <button type="button" onClick={() => move(index, -1)} disabled={index === 0 || busy !== null} className={buttonClass.icon} aria-label={`Move ${title} up`}>
                      <LuArrowUp aria-hidden="true" className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => move(index, 1)} disabled={index === visible.length - 1 || busy !== null} className={buttonClass.icon} aria-label={`Move ${title} down`}>
                      <LuArrowDown aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                )}
                {!projectGrid && <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface-2 text-accent">
                  {image?.url ? (
                    <Image src={image.url} alt="" fill sizes="48px" className="object-cover" />
                  ) : config.iconKey ? (
                    createElement(getIcon(String(getPath(item, config.iconKey) ?? "")), { "aria-hidden": true, className: "size-5" })
                  ) : (
                    <span className="text-sm font-semibold">{title.slice(0, 1)}</span>
                  )}
                </span>}
                <div className="min-w-0 flex-1">
                  {(resource === "education" || resource === "experience") && <p className="mb-1.5 font-mono text-[0.65rem] text-subtle">{String(item.startDate || "Date not specified")}{resource === "experience" ? ` — ${item.current ? "Present" : String(item.endDate || "End date not specified")}` : item.completionYear ? ` — ${item.completionYear}` : ""}</p>}
                  <Link href={`${config.adminPath}/${item.id}`} className="block truncate text-sm font-semibold text-fg hover:text-accent">
                    {title}
                  </Link>
                  {subtitle ? <p className={`mt-1 text-sm leading-6 text-muted ${resource === "services" ? "line-clamp-3" : "truncate"}`}>{String(subtitle)}</p> : null}
                  {resource === "projects" && item.summary ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{String(item.summary)}</p> : null}
                  {resource === "experience" && item.description ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{String(item.description)}</p> : null}
                  {resource === "education" && item.note ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{String(item.note)}</p> : null}
                  {resource === "services" && Array.isArray(item.includes) && item.includes.length > 0 && <p className="mt-3 text-xs leading-5 text-subtle">{item.includes.length} included deliverable{item.includes.length === 1 ? "" : "s"}<span className="mt-1 block line-clamp-2">{item.includes.slice(0, 3).join(" · ")}</span></p>}
                </div>
                </div>
                <div className="admin-resource-meta">
                  {config.columns.map((column) => (
                    <Cell key={column.key} column={column} item={item} lookups={lookups} />
                  ))}
                </div>
                <div className="admin-resource-actions">
                  {config.toggle && (
                    <button type="button" onClick={() => toggle(item)} disabled={busy !== null} className={buttonClass.ghost}>
                      {toggleState ? <LuEyeOff aria-hidden="true" className="size-4" /> : <LuEye aria-hidden="true" className="size-4" />}
                      {toggleState ? config.toggle.turnOff : config.toggle.turnOn}
                      <span className="sr-only">: {title}</span>
                    </button>
                  )}
                  <Link href={`${config.adminPath}/${item.id}`} className={buttonClass.secondary} aria-label={`Edit ${title}`}>
                    <LuPencil aria-hidden="true" className="size-3.5" />Edit
                  </Link>
                  <button type="button" onClick={() => remove(item)} disabled={busy !== null} className={`${buttonClass.icon} hover:bg-danger-soft hover:text-danger`} aria-label={`Delete ${title}`} title="Delete">
                    <LuTrash2 aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </li>
            );
          }} />
      )}
    </div>
  );
}

function Cell({ column, item, lookups }: { column: Column; item: Item; lookups: Record<string, Record<string, string>> }) {
  const raw = getPath(item, column.key);
  const key = String(raw);
  if (column.kind === "badge") {
    const label = column.labels?.[key] ?? key;
    if (!label) return null;
    return <StatusBadge tone={column.tones?.[key] ?? "default"}>{label}</StatusBadge>;
  }
  if (column.kind === "date") {
    return <span className="hidden text-xs text-muted md:inline">{formatDate(String(raw ?? ""))}</span>;
  }
  const text = lookups[column.key]?.[key] ?? key;
  if (!text || column.key === "categoryId") return null; // category is already the subtitle
  return <span className="hidden text-xs text-muted md:inline">{text}</span>;
}
