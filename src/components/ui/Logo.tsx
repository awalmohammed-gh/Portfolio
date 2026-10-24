import Image from "next/image";
import type { ImageAsset } from "@/types/media";

/**
 * Brand Logo component:
 * - Uses the uploaded custom emblem logo with theme adaptation (light vs dark mode).
 * - Falls back to custom uploaded Site Settings image if configured.
 */
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
        className={`h-9 w-auto object-contain ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative size-9 shrink-0">
        <Image
          src="/images/logo-transparent.png"
          alt={`${name} emblem`}
          width={36}
          height={36}
          priority
          className="size-9 object-contain dark-theme-hidden"
        />
        <Image
          src="/images/logo-dark-mode.png"
          alt={`${name} emblem`}
          width={36}
          height={36}
          priority
          className="size-9 object-contain light-theme-hidden"
        />
      </div>
      <span className="text-base sm:text-lg font-bold tracking-tight text-fg truncate">
        {name}
      </span>
    </div>
  );
}
