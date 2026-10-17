import type { Metadata } from "next";
import { Suspense } from "react";
import MediaLibrary from "@/components/admin/media/MediaLibrary";
import { AdminPageHeader, CardsSkeleton } from "@/components/admin/ui";
import { listMedia } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Media Library" };

export default function MediaPage() {
  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Images uploaded to Cloudinary. Upload here or from any image field, then pick them anywhere on the site."
        crumbs={[{ label: "Media Library" }]}
      />
      <Suspense fallback={<CardsSkeleton count={6} />}>
        <Library />
      </Suspense>
    </>
  );
}

async function Library() {
  return <MediaLibrary initialItems={await listMedia()} />;
}
