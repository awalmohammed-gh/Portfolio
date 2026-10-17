import { ResourceEditPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Edit · Skills" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource="skills" params={params} />;
}
