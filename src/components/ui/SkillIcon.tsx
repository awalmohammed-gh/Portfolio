import Image from "next/image";
import type { Skill } from "@/types/content";
import Icon from "./Icon";

/** A skill's uploaded logo if it has one, otherwise its icon. */
export default function SkillIcon({ skill, className }: { skill: Skill; className?: string }) {
  if (skill.iconImage) {
    return (
      <Image
        src={skill.iconImage.url}
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        className={`${className ?? ""} object-contain`}
      />
    );
  }
  return <Icon name={skill.icon} aria-hidden="true" className={className} />;
}
