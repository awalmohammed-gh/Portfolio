"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LuEye, LuEyeOff, LuLoaderCircle, LuLogOut, LuMonitor, LuShieldCheck, LuUserRound } from "react-icons/lu";
import { api, ApiClientError } from "./api-client";
import { useConfirm, useToast } from "./Feedback";
import { buttonClass, cardClass, errorClass, helpClass, inputClass, labelClass } from "./form/styles";
import { formatDate } from "./ui";
import { useUnsavedChanges } from "./NavigationGuard";

function useSubmit() {
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});

  async function run(task: () => Promise<void>) {
    setPending(true);
    setFields({});
    try {
      await task();
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFields(error.fields);
        toast.error(error.message);
      } else toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }
  return { pending, fields, run, toast };
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  autoComplete,
  help,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  autoComplete?: string;
  help?: string;
  error?: string;
}) {
  const id = `profile-${name}`;
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative mt-2"><input
        id={id}
        name={name}
        type={type === "password" && showPassword ? "text" : type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : help ? `${id}-help` : undefined}
        className={`${inputClass} ${type === "password" ? "pr-11" : ""}`}
      />
      {type === "password" && <button type="button" onClick={() => setShowPassword((shown) => !shown)} className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg" aria-label={`${showPassword ? "Hide" : "Show"} ${label.toLowerCase()}`}>{showPassword ? <LuEyeOff aria-hidden="true" className="size-4" /> : <LuEye aria-hidden="true" className="size-4" />}</button>}</div>
      {help && !error && (
        <p id={`${id}-help`} className={helpClass}>
          {help}
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

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const { pending, fields, run, toast } = useSubmit();
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    run(async () => {
      await api("/api/auth/me", { method: "PATCH", body: { name: form.get("name"), email: form.get("email") } });
      toast.success("Profile updated.");
      setDirty(false);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} onChange={(event) => { const values = new FormData(event.currentTarget); setDirty(values.get("name") !== name || values.get("email") !== email); }} className={`${cardClass} min-w-0 space-y-5 p-6`} noValidate>
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><LuUserRound aria-hidden="true" className="size-4" /></span><div><h2 className="text-sm font-semibold text-fg">Personal details</h2><p className="mt-1 text-xs leading-5 text-muted">How you sign in to your workspace.</p></div></div>
      <Field name="name" label="Name" defaultValue={name} autoComplete="name" error={fields.name} />
      <Field name="email" label="Sign-in email" type="email" defaultValue={email} autoComplete="email" error={fields.email} />
      <button type="submit" disabled={pending} className={buttonClass.primary}>
        {pending && <LuLoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
        Save profile
      </button>
    </form>
  );
}

export function PasswordForm() {
  const router = useRouter();
  const { pending, fields, run, toast } = useSubmit();
  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);
    run(async () => {
      const { data } = await api<{ revokedSessions: number }>("/api/auth/password", {
        method: "POST",
        body: {
          currentPassword: form.get("currentPassword"),
          newPassword: form.get("newPassword"),
          confirmPassword: form.get("confirmPassword"),
        },
      });
      element.reset();
      setDirty(false);
      toast.success(
        data.revokedSessions > 0
          ? `Password changed. Signed out ${data.revokedSessions} other session${data.revokedSessions === 1 ? "" : "s"}.`
          : "Password changed.",
      );
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} onChange={(event) => setDirty([...new FormData(event.currentTarget).values()].some(Boolean))} className={`${cardClass} min-w-0 space-y-5 p-6`} noValidate>
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent"><LuShieldCheck aria-hidden="true" className="size-4" /></span><div><h2 className="text-sm font-semibold text-fg">Password & security</h2><p className="mt-1 text-xs leading-5 text-muted">Keep your account in your hands.</p></div></div>
      <Field name="currentPassword" label="Current password" type="password" autoComplete="current-password" error={fields.currentPassword} />
      <Field name="newPassword" label="New password" type="password" autoComplete="new-password" help="At least 12 characters." error={fields.newPassword} />
      <Field name="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" error={fields.confirmPassword} />
      <button type="submit" disabled={pending} className={buttonClass.primary}>
        {pending && <LuLoaderCircle aria-hidden="true" className="size-4 animate-spin" />}
        Change password
      </button>
    </form>
  );
}

type SessionRow = { id: string; current: boolean; userAgent: string; ip: string; createdAt: string; lastUsedAt: string };

function describeAgent(agent: string) {
  if (!agent) return "Unknown device";
  const browser = /Edg\//.test(agent) ? "Edge" : /Chrome\//.test(agent) ? "Chrome" : /Firefox\//.test(agent) ? "Firefox" : /Safari\//.test(agent) ? "Safari" : "Browser";
  const os = /Windows/.test(agent) ? "Windows" : /Mac OS X/.test(agent) ? "macOS" : /Android/.test(agent) ? "Android" : /iPhone|iPad/.test(agent) ? "iOS" : /Linux/.test(agent) ? "Linux" : "";
  return os ? `${browser} on ${os}` : browser;
}

export function SessionList({ sessions }: { sessions: SessionRow[] }) {
  const router = useRouter();
  const confirm = useConfirm();
  const { pending, run, toast } = useSubmit();
  const others = sessions.filter((s) => !s.current).length;

  async function revokeOthers() {
    const ok = await confirm({
      title: "Sign out other sessions?",
      message: "Every other browser or device signed in to the dashboard will be signed out.",
      confirmLabel: "Sign out others",
      tone: "danger",
    });
    if (!ok) return;
    run(async () => {
      const { data } = await api<{ revoked: number }>("/api/auth/sessions", { method: "DELETE" });
      toast.success(`Signed out ${data.revoked} session${data.revoked === 1 ? "" : "s"}.`);
      router.refresh();
    });
  }

  return (
    <section className={`${cardClass} p-6`} aria-labelledby="sessions-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="sessions-heading" className="text-base font-semibold tracking-tight text-fg">
          Active sessions
        </h2>
        <button type="button" onClick={revokeOthers} disabled={pending || others === 0} className={buttonClass.danger}>
          <LuLogOut aria-hidden="true" className="size-4" />
          Sign out other sessions
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">Sessions expire after 7 days. Logging out ends the current one.</p>
      <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
        {sessions.map((session) => (
          <li key={session.id} className="flex items-start gap-3 px-4 py-3">
            <LuMonitor aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium text-fg">
                {describeAgent(session.userAgent)}
                {session.current && <span className="ml-2 text-xs font-medium text-success">This device</span>}
              </p>
              <p className="text-xs leading-5 break-words text-muted">
                Signed in {formatDate(session.createdAt)} · last active {formatDate(session.lastUsedAt)}
                {session.ip && session.ip !== "unknown" ? ` · ${session.ip}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
