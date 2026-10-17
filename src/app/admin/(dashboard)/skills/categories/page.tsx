import { ResourceIndexPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Skill categories" };

export default function Page() {
  return (
    <ResourceIndexPage
      resource="skill-categories"
      crumbs={[{ label: "Skills", href: "/admin/skills" }, { label: "Categories" }]}
    />
  );
}
