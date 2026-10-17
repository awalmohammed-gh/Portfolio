import { ResourceNewPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "New · Skill categories" };

export default function Page() {
  return <ResourceNewPage resource="skill-categories" parentCrumbs={[{ label: "Skills", href: "/admin/skills" }]} />;
}
