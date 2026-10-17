/** Shared controls for every admin surface, using the existing theme tokens. */
export const inputClass =
  "admin-input block min-w-0 w-full rounded-lg border border-line bg-bg/50 px-3.5 py-2.5 text-[0.8rem] text-fg transition outline-none placeholder:text-subtle hover:border-line-strong/60 focus:border-accent focus:bg-surface focus:ring-4 focus:ring-accent/10 aria-invalid:border-danger aria-invalid:focus:ring-danger/20 disabled:opacity-60";

export const labelClass = "block text-xs font-medium text-fg";
export const helpClass = "mt-1.5 text-xs leading-5 text-muted";
export const errorClass = "mt-1.5 text-xs font-medium text-danger";

export const buttonClass = {
  primary:
    "admin-button admin-button-primary inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-accent-fg shadow-sm transition hover:bg-accent-hover disabled:pointer-events-none disabled:opacity-60",
  secondary:
    "admin-button inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-xs font-medium text-fg transition hover:border-line-strong hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-60",
  ghost:
    "admin-button inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted transition hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-50",
  danger:
    "admin-button inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-danger transition hover:bg-danger-soft disabled:pointer-events-none disabled:opacity-50",
  icon: "admin-button-icon grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-surface-2 hover:text-fg disabled:pointer-events-none disabled:opacity-40",
} as const;

export const cardClass = "admin-panel";
