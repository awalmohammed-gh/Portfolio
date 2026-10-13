import Image from "next/image";
import { site } from "@/data/site";

/** Fills its (positioned) parent, cropped toward Mohammed in the office scene. */
export default function ProfilePhoto({
  sizes,
  preload = false,
}: {
  sizes: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={site.profileImage.src}
      alt={site.profileImage.alt}
      fill
      preload={preload}
      sizes={sizes}
      className="profile-photo"
    />
  );
}
