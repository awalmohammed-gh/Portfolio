"use client";

import { useState, type FormEvent } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import { services } from "@/data/services";
import { site } from "@/data/site";

const fieldClass =
  "mt-2 w-full rounded-lg bg-navy-950/70 px-4 py-3 text-sm text-ink ring-1 ring-white/10 placeholder:text-ink-subtle outline-none transition focus:ring-2 focus:ring-accent";

/**
 * Frontend-only contact form: it composes an email in the visitor's mail app
 * instead of posting to a server.
 */
export default function ContactForm() {
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = `Project enquiry${service ? `: ${service}` : ""} from ${name}`;
    const body = [message, "", "—", `Name: ${name}`, `Email: ${email}`, service && `Service: ${service}`]
      .filter((line) => line !== "")
      .join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="reveal rounded-2xl bg-navy-900/70 p-6 ring-1 ring-white/5 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Name
          <input name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" />
        </label>
        <label className="block text-sm font-medium text-ink">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-medium text-ink">
        Service <span className="font-normal text-ink-subtle">(optional)</span>
        <select name="service" defaultValue="" className={fieldClass}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.title} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </label>

      <label className="mt-5 block text-sm font-medium text-ink">
        Message
        <textarea
          name="message"
          required
          rows={6}
          className={`${fieldClass} resize-y`}
          placeholder="Tell me about your project, goals, and timeline."
        />
      </label>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-navy-950 transition hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto"
      >
        <FaPaperPlane aria-hidden className="size-3.5" />
        Send message
      </button>

      <p className="mt-4 text-xs text-ink-subtle" aria-live="polite">
        {opened
          ? `Your email app should now be open with the message ready to send. If it didn't open, email ${site.email} directly.`
          : "Submitting opens your email app with this message pre-filled."}
      </p>
    </form>
  );
}
