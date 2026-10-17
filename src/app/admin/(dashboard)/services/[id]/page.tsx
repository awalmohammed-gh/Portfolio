import { ResourceEditPage } from "@/components/admin/ResourcePages";

export const metadata = { title: "Edit · Services" };

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ResourceEditPage resource="services" params={params} />;
}
