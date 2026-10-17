import { ResourceEditPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Edit · Skill categories" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource="skill-categories" params={params} parentCrumbs={[{ label: "Skills", href: "/admin/skills" }]} />;
}
