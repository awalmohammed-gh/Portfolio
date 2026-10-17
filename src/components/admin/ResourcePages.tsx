import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LuPlus } from "react-icons/lu";
import {
  getProject,
  getRecord,
  listEducation,
  listExperience,
  listProjects,
  listServices,
  listSkillCategories,
  listSkills,
} from "@/lib/data/admin";
import { buttonClass } from "./form/styles";
import type { DynamicOptions } from "./form/types";
import ResourceForm from "./ResourceForm";
import ResourceList from "./ResourceList";
import { resources, type ResourceKey } from "./resources";
import { AdminPageHeader, FormSkeleton, ListSkeleton, type Crumb } from "./ui";

/*
 * Server components shared by the admin list/create/edit pages. Data loads
 * inside Suspense (with skeletons) because it reads the session cookie.
 */

async function loadItems(resource: ResourceKey) {
  switch (resource) {
    case "projects":
      return listProjects();
    case "skills":
      return listSkills();
    case "skill-categories":
      return listSkillCategories();
    case "services":
      return listServices();
    case "education":
      return listEducation();
    case "experience":
      return listExperience();
  }
}

async function loadItem(resource: ResourceKey, id: string) {
  return resource === "projects" ? getProject(id) : getRecord(resource, id);
}

/** Select options and suggestions that come from the database. */
async function loadOptions(resource: ResourceKey): Promise<{ options: DynamicOptions; lookups: Record<string, Record<string, string>> }> {
  if (resource === "skills") {
    const categories = await listSkillCategories();
    return {
      options: { categories: categories.map((c) => ({ value: c.id, label: c.title })) },
      lookups: { categoryId: Object.fromEntries(categories.map((c) => [c.id, c.title])) },
    };
  }
  if (resource === "projects" || resource === "experience") {
    const skills = await listSkills();
    return { options: { skillNames: skills.map((s) => ({ value: s.name, label: s.name })) }, lookups: {} };
  }
  return { options: {}, lookups: {} };
}

export function ResourceIndexPage({
  resource,
  crumbs,
  extraActions,
}: {
  resource: ResourceKey;
  crumbs?: Crumb[];
  extraActions?: React.ReactNode;
}) {
  const config = resources[resource];
  return (
    <>
      <AdminPageHeader
        title={config.plural}
        description={config.description}
        crumbs={crumbs ?? [{ label: config.plural }]}
        actions={
          <>
            {extraActions}
            <Link href={`${config.adminPath}/new`} className={buttonClass.primary}>
              <LuPlus aria-hidden="true" className="size-4" />
              Add {config.singular.toLowerCase()}
            </Link>
          </>
        }
      />
      <Suspense fallback={<ListSkeleton />}>
        <IndexContent resource={resource} />
      </Suspense>
    </>
  );
}

async function IndexContent({ resource }: { resource: ResourceKey }) {
  const [items, { options, lookups }] = await Promise.all([loadItems(resource), loadOptions(resource)]);
  return (
    <ResourceList
      resource={resource}
      items={items as unknown as (Record<string, unknown> & { id: string })[]}
      options={options}
      lookups={lookups}
      reorderScope={resource === "skills" ? "categoryId" : undefined}
    />
  );
}

export function ResourceNewPage({ resource, parentCrumbs = [] }: { resource: ResourceKey; parentCrumbs?: Crumb[] }) {
  const config = resources[resource];
  return (
    <>
      <AdminPageHeader
        title={`New ${config.singular.toLowerCase()}`}
        crumbs={[...parentCrumbs, { label: config.plural, href: config.adminPath }, { label: "New" }]}
      />
      <Suspense fallback={<FormSkeleton />}>
        <NewContent resource={resource} />
      </Suspense>
    </>
  );
}

async function NewContent({ resource }: { resource: ResourceKey }) {
  const { options } = await loadOptions(resource);
  return <ResourceForm resource={resource} options={options} />;
}

export function ResourceEditPage({
  resource,
  params,
  parentCrumbs = [],
}: {
  resource: ResourceKey;
  params: Promise<{ id: string }>;
  parentCrumbs?: Crumb[];
}) {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditContent resource={resource} params={params} parentCrumbs={parentCrumbs} />
    </Suspense>
  );
}

async function EditContent({
  resource,
  params,
  parentCrumbs,
}: {
  resource: ResourceKey;
  params: Promise<{ id: string }>;
  parentCrumbs: Crumb[];
}) {
  const config = resources[resource];
  const { id } = await params;
  const [item, { options }] = await Promise.all([loadItem(resource, id), loadOptions(resource)]);
  if (!item) notFound();
  const title = String((item as Record<string, unknown>)[config.titleKey] ?? config.singular);

  return (
    <>
      <AdminPageHeader
        title={title}
        description={`Update the details, appearance and visibility of this ${config.singular.toLowerCase()}.`}
        crumbs={[...parentCrumbs, { label: config.plural, href: config.adminPath }, { label: title }]}
      />
      {/* Re-keyed on save so the form picks up server-side changes (e.g. a generated slug). */}
      <ResourceForm
        key={(item as { updatedAt?: string }).updatedAt}
        resource={resource}
        item={item as unknown as Parameters<typeof ResourceForm>[0]["item"]}
        options={options}
      />
    </>
  );
}
