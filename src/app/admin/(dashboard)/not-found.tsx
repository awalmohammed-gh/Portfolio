import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { buttonClass } from "@/components/admin/form/styles";

export default function AdminNotFound() {
  return (
    <div className="admin-panel admin-page-state grid place-items-center px-6 py-20 text-center">
      <p className="text-gradient text-5xl font-semibold tracking-tight">404</p>
      <h1 className="mt-3 text-xl font-semibold tracking-tight text-fg">This item doesn&apos;t exist</h1>
      <p className="mt-2 text-sm text-muted">It may have been deleted.</p>
      <Link href="/admin" className={`${buttonClass.secondary} mt-6`}>
        <LuArrowLeft aria-hidden="true" className="size-4" />
        Back to dashboard
      </Link>
    </div>
  );
}
