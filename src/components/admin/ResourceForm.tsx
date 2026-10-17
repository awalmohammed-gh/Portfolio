"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuExternalLink, LuEye, LuTrash2 } from "react-icons/lu";
import { api, ApiClientError } from "./api-client";
import { useConfirm, useToast } from "./Feedback";
import SchemaForm from "./form/SchemaForm";
import { buttonClass } from "./form/styles";
import type { DynamicOptions, FormValues } from "./form/types";
import { resources, type ResourceKey } from "./resources";
import { formatDate } from "./ui";

/** Create/edit form for a content collection, wired to its REST endpoints. */
export default function ResourceForm({
  resource,
  item,
  options,
}: {
  resource: ResourceKey;
  item?: FormValues & { id: string; updatedAt?: string; slug?: string; publishStatus?: string };
  options?: DynamicOptions;
}) {
  const config = resources[resource];
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [deleting, setDeleting] = useState(false);
  const isNew = !item;

  async function remove() {
    if (!item) return;
    const title = String(item[config.titleKey] ?? config.singular);
    const ok = await confirm({
      title: `Delete “${title}”?`,
      message: `This permanently removes the ${config.singular.toLowerCase()} from the site.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await api(`${config.apiPath}/${item.id}`, { method: "DELETE" });
      toast.success(`Deleted “${title}”.`);
      router.replace(config.adminPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiClientError ? error.message : "Couldn't delete.");
      setDeleting(false);
    }
  }

  const variants = config.variants ?? [{ label: isNew ? `Create ${config.singular.toLowerCase()}` : "Save changes", primary: true }];

  return (
    <SchemaForm
      fields={config.fields}
      initialValues={{ ...config.defaults, ...item }}
      options={options}
      action={isNew ? { url: config.apiPath, method: "POST" } : { url: `${config.apiPath}/${item.id}`, method: "PATCH" }}
      variants={variants}
      successMessage={isNew ? `${config.singular} created.` : "Saved. The public site now shows this version."}
      onSaved={(data) => {
        if (isNew) router.replace(`${config.adminPath}/${String(data.id)}`);
        else router.refresh();
      }}
      aside={
        item && (
          <div className="admin-panel space-y-4 p-5 text-sm">
            <h2 className="text-xs font-semibold tracking-wide text-fg">Record details</h2>
            {item.updatedAt && (
              <p className="text-xs text-muted">
                Last updated <time dateTime={item.updatedAt}>{formatDate(item.updatedAt)}</time>
              </p>
            )}
            {config.previewable && (
              <Link href={`${config.adminPath}/${item.id}/preview`} target="_blank" className={`${buttonClass.secondary} w-full`}>
                <LuEye aria-hidden="true" className="size-4" />
                Preview saved version
              </Link>
            )}
            {resource === "projects" && item.publishStatus === "published" && item.slug && (
              <Link href={`/projects/${item.slug}`} target="_blank" className={`${buttonClass.ghost} w-full`}>
                <LuExternalLink aria-hidden="true" className="size-4" />
                View on site
              </Link>
            )}
            <div className="border-t border-line pt-3"><button type="button" onClick={remove} disabled={deleting} className={`${buttonClass.danger} w-full`}>
              <LuTrash2 aria-hidden="true" className="size-4" />
              Delete {config.singular.toLowerCase()}
            </button></div>
          </div>
        )
      }
    />
  );
}
