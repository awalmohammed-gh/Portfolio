import Image from "next/image";
import type { ImageAsset } from "@/types/media";

/** Uploaded logo if one is set in Site Settings, otherwise the name wordmark. */
export default function Logo({
  name,
  image,
  className = "",
}: {
  name: string;
  image?: ImageAsset;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        src={image.url}
        alt={image.alt || name}
        width={image.width ?? 160}
        height={image.height ?? 40}
        className={`h-9 w-auto ${className}`}
      />
    );
  }

  return (
    <span className={`text-xl font-semibold tracking-tight text-fg ${className}`}>
      {name}
      <span className="text-accent">.</span>
    </span>
  );
}
