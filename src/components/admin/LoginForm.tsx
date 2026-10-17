"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LuEye, LuEyeOff, LuLoaderCircle, LuLogIn } from "react-icons/lu";
import { api, ApiClientError } from "./api-client";
import { buttonClass, errorClass, inputClass, labelClass } from "./form/styles";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    setFields({});
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: { email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") },
      });
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        setFields(err.fields);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-panel p-6 sm:p-7" noValidate>
      {error && (
        <p role="alert" className="mb-5 rounded-xl border border-danger/30 bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
      <div className="space-y-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            aria-invalid={fields.email ? true : undefined}
            aria-describedby={fields.email ? "email-error" : undefined}
            className={`${inputClass} mt-2`}
          />
          {fields.email && (
            <p id="email-error" className={errorClass}>
              {fields.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-invalid={fields.password ? true : undefined}
              aria-describedby={fields.password ? "password-error" : undefined}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <LuEyeOff aria-hidden="true" className="size-4" /> : <LuEye aria-hidden="true" className="size-4" />}
            </button>
          </div>
          {fields.password && (
            <p id="password-error" className={errorClass}>
              {fields.password}
            </p>
          )}
        </div>
      </div>
      <button type="submit" disabled={pending} className={`${buttonClass.primary} mt-7 h-11 w-full`}>
        {pending ? <LuLoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <LuLogIn aria-hidden="true" className="size-4" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
