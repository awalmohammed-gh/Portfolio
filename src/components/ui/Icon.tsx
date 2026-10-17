import { createElement } from "react";
import type { IconBaseProps } from "react-icons";
import { getIcon } from "@/lib/icons";

/** Renders an icon stored by name in the database (see lib/icons). */
export default function Icon({ name, ...props }: { name: string } & IconBaseProps) {
  return createElement(getIcon(name), props);
}
