import Link from "next/link";
import { LuFolderTree } from "react-icons/lu";
import { buttonClass } from "@/components/admin/form/styles";
import { ResourceIndexPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Skills" };

export default function Page() {
  return (
    <ResourceIndexPage
      resource="skills"
      extraActions={
        <Link href="/admin/skills/categories" className={buttonClass.secondary}>
          <LuFolderTree aria-hidden="true" className="size-4" />
          Manage categories
        </Link>
      }
    />
  );
}
