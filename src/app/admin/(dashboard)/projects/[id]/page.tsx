import { ResourceEditPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Edit · Projects" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource="projects" params={params} />;
}
