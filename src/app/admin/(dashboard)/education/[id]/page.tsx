import { ResourceEditPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Edit · Education" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource="education" params={params} />;
}
