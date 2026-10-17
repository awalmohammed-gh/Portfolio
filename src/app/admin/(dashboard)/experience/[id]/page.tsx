import { ResourceEditPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Edit · Experience" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource="experience" params={params} />;
}
