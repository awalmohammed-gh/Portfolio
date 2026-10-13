"use client";

import { useState, type FormEvent } from "react";
import { LuSend } from "react-icons/lu";
import { services } from "@/data/services";
import { site } from "@/data/site";

const fieldClass =
  "mt-2 block w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-base text-fg transition outline-none placeholder:text-subtle focus:border-accent focus:ring-4 focus:ring-accent/20";

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
    const body = [
      message,
      "",
      "—",
      `Name: ${name}`,
      `Email: ${email}`,
      ...(service ? [`Service: ${service}`] : []),
    ].join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-title"
      className="reveal rounded-4xl border border-line bg-surface p-6 shadow-card sm:p-9"
    >
      <h2 id="contact-form-title" className="text-2xl font-semibold tracking-tight text-fg">
        Send a message
      </h2>
      <p className="mt-2 text-[0.95rem] leading-7 text-muted">
        Tell me about your project. I’ll reply by email.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-fg">
          Your name
          <input
            name="name"
            required
            autoComplete="name"
            maxLength={120}
            className={fieldClass}
            placeholder="Your full name"
          />
        </label>
        <label className="block text-sm font-medium text-fg">
          Email address
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={254}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-5 block text-sm font-medium text-fg">
        Service <span className="font-normal text-muted">(optional)</span>
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

      <label className="mt-5 block text-sm font-medium text-fg">
        Message
        <textarea
          name="message"
          required
          rows={6}
          maxLength={5000}
          className={`${fieldClass} resize-y leading-7`}
          placeholder="Tell me about your project, goals, and timeline."
        />
      </label>

      <button
        type="submit"
        className="group mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-medium text-accent-fg shadow-[0_8px_24px_-10px] shadow-accent/60 transition hover:bg-accent-hover sm:w-auto"
      >
        Send message
        <LuSend
          aria-hidden="true"
          className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>

      <p className="mt-4 text-sm leading-6 text-muted" aria-live="polite">
        {opened
          ? `Your email app should now be open with the message ready to send. If it didn’t open, email ${site.email} directly.`
          : "Submitting opens your email app with this message pre-filled, so you can review it before sending."}
      </p>
    </form>
  );
}
