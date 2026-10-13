import { site } from "@/data/site";

/** Name wordmark used as the site logo. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`text-xl font-semibold tracking-tight text-fg ${className}`}>
      {site.name}
      <span className="text-accent">.</span>
    </span>
  );
}
