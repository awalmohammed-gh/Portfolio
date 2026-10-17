import { getPath } from "./form/types";
import { resources, type ResourceKey } from "./resources";
import type { AdminResourceItem } from "./ResourceCollection";
import { CollectionSummary } from "./ui";

const descriptions: Record<ResourceKey, { title: string; description: string }> = {
  projects: { title: "Your project collection", description: "Manage case studies, prepare drafts and choose what the world sees." },
  skills: { title: "Your technical toolkit", description: "Organize technologies by category and control where they appear." },
  "skill-categories": { title: "Keep your skills organized", description: "These groups define the structure of your public skills section." },
  services: { title: "What you offer", description: "Shape your service offering and the deliverables clients can expect." },
  education: { title: "Your learning journey", description: "Keep qualifications, certificates and education history together." },
  experience: { title: "Your professional journey", description: "Build a clear timeline of roles, contributions and achievements." },
};

export default function ResourceSummary({ resource, items }: { resource: ResourceKey; items: AdminResourceItem[] }) {
  const config = resources[resource];
  const metrics = [{ label: "Total records", value: items.length }];
  if (config.toggle) {
    const toggle = config.toggle;
    const on = items.filter((item) => getPath(item, toggle.key) === toggle.on).length;
    metrics.push({ label: toggle.onLabel, value: on }, { label: toggle.offLabel === "Draft" ? "Drafts" : toggle.offLabel, value: items.length - on });
  }
  if (resource === "experience") metrics.push({ label: "Current roles", value: items.filter((item) => item.current === true).length });
  return <CollectionSummary {...descriptions[resource]} metrics={metrics} />;
}
