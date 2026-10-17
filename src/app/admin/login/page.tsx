import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LuArrowLeft, LuArrowUpRight, LuCheck, LuFolderKanban, LuImage, LuPanelsTopLeft, LuPenLine } from "react-icons/lu";
import LoginForm from "@/components/admin/LoginForm";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { getOptionalAdmin } from "@/lib/auth/guard";

export const metadata: Metadata = { title: "Sign in" };
export default function LoginPage() {
  return <div className="admin-login">
    <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-10"><Link href="/" className="flex items-center gap-2 text-sm font-semibold"><span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg"><LuPanelsTopLeft aria-hidden="true" className="size-4" /></span>Portfolio<span className="text-accent">.</span></Link><ThemeToggle /></header>
    <main className="admin-login-grid">
      <section className="admin-login-story" aria-labelledby="workspace-title">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Your creative workspace</p>
        <h1 id="workspace-title" className="mt-6 max-w-lg text-4xl leading-[1.15] font-semibold tracking-[-0.05em] text-fg xl:text-5xl">Good work deserves<br />a great portfolio<span className="text-accent">.</span></h1>
        <p className="mt-5 max-w-sm text-sm leading-7 text-muted">One place to shape your story, share your projects, and keep your portfolio moving forward.</p>
        <div className="mt-10 max-w-sm space-y-4">{[{ icon: LuFolderKanban, title: "Put your work in the spotlight", text: "Create projects and publish when you’re ready." }, { icon: LuPenLine, title: "Make every word yours", text: "Update your pages, skills and experience." }, { icon: LuImage, title: "Keep your visuals together", text: "Upload, organize and reuse your images." }].map(({ icon: Icon, title, text }) => <div key={title} className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface text-accent"><Icon aria-hidden="true" className="size-4" /></span><div><p className="text-xs font-semibold text-fg">{title}</p><p className="mt-1 text-xs leading-5 text-muted">{text}</p></div></div>)}</div>
        <Link href="/" className="mt-10 inline-flex items-center gap-2 text-xs font-medium text-accent">Visit your portfolio<LuArrowUpRight aria-hidden="true" className="size-3.5" /></Link>
      </section>
      <section className="admin-login-form" aria-labelledby="login-title">
        <div className="mb-7"><span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-[0.65rem] font-medium text-muted"><LuCheck aria-hidden="true" className="size-3 text-accent" />Private admin access</span><h2 id="login-title" className="text-2xl font-semibold tracking-tight text-fg">Welcome back</h2><p className="mt-2 text-sm text-muted">Sign in to manage your portfolio.</p></div>
        <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl border border-line bg-surface" />}><RedirectIfSignedIn><LoginForm /></RedirectIfSignedIn></Suspense>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs text-muted hover:text-accent"><LuArrowLeft aria-hidden="true" className="size-3.5" />Back to portfolio</Link>
      </section>
    </main>
    <footer className="px-6 py-5 text-center text-xs text-subtle">A space for your next chapter.</footer>
  </div>;
}
async function RedirectIfSignedIn({ children }: { children: React.ReactNode }) {
  if (await getOptionalAdmin()) redirect("/admin");
  return children;
}
