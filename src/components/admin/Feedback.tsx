"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { LuCircleAlert, LuCircleCheck, LuTriangleAlert, LuX } from "react-icons/lu";
import { buttonClass } from "./form/styles";

/* --------------------------------- Toasts --------------------------------- */

type Toast = { id: number; tone: "success" | "error"; message: string };
type ToastApi = { success: (message: string) => void; error: (message: string) => void };

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const context = use(ToastContext);
  if (!context) throw new Error("useToast must be used inside <FeedbackProvider>");
  return context;
}

/* ------------------------------ Confirm dialog ---------------------------- */

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};
type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const context = use(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used inside <FeedbackProvider>");
  return context;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const push = useCallback(
    (tone: Toast["tone"], message: string) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === "error" ? 7000 : 4000);
    },
    [dismiss],
  );
  const toastApi = useMemo<ToastApi>(
    () => ({ success: (m) => push("success", m), error: (m) => push("error", m) }),
    [push],
  );

  const dialogRef = useRef<HTMLDialogElement>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);
  const [pending, setPending] = useState<ConfirmOptions | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    setPending(options);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  useEffect(() => {
    if (pending && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [pending]);

  function close(result: boolean) {
    resolver.current?.(result);
    resolver.current = null;
    dialogRef.current?.close();
    setPending(null);
  }

  return (
    <ToastContext value={toastApi}>
      <ConfirmContext value={confirm}>
        {children}

        <dialog
          ref={dialogRef}
          onCancel={(event) => {
            event.preventDefault();
            close(false);
          }}
          aria-labelledby="confirm-title"
          className="admin-dialog m-auto w-[min(28rem,calc(100vw-2rem))] border border-line bg-surface p-0 text-fg shadow-card backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
          {pending && (
            <div className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl ${
                    pending.tone === "danger" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent"
                  }`}
                >
                  <LuTriangleAlert aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 id="confirm-title" className="text-lg font-semibold tracking-tight">
                    {pending.title}
                  </h2>
                  {pending.message && <p className="mt-1.5 text-[0.95rem] leading-6 text-muted">{pending.message}</p>}
                </div>
              </div>
              <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => close(false)}
                  className={buttonClass.secondary}
                  autoFocus
                >
                  {pending.cancelLabel ?? "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => close(true)}
                  className={`admin-button min-h-10 rounded-lg px-4 py-2.5 text-xs font-medium transition ${
                    pending.tone === "danger" ? "border border-danger/30 bg-danger-soft text-danger hover:bg-danger/20" : "bg-accent text-accent-fg hover:bg-accent-hover"
                  }`}
                >
                  {pending.confirmLabel ?? "Confirm"}
                </button>
              </div>
            </div>
          )}
        </dialog>

        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role={toast.tone === "error" ? "alert" : "status"}
              className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-fg shadow-card"
            >
              {toast.tone === "success" ? (
                <LuCircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <LuCircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
              )}
              <p className="flex-1 leading-5">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-m-1 grid size-6 place-items-center rounded-full text-muted hover:text-fg"
              >
                <LuX aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </ConfirmContext>
    </ToastContext>
  );
}
