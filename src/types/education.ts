import type { ImageAsset } from "./media";

export const qualificationStatuses = ["completed", "graduation-pending", "in-progress"] as const;
export type QualificationStatus = (typeof qualificationStatuses)[number];

export interface Qualification {
  title: string;
  shortTitle: string;
  status: QualificationStatus;
  /** Human-readable status, e.g. "Completed 2017". Never claims an award that isn't confirmed. */
  statusLabel: string;
}

export interface EducationEntry {
  id: string;
  /** Shown above the institution, e.g. "University". */
  level: string;
  /** Icon name from lib/icons. */
  icon: string;
  institution: string;
  institutionShort?: string;
  qualification: Qualification;
  course?: string;
  /** "YYYY" or "YYYY-MM" */
  startDate?: string;
  /** Only set when the year is confirmed. */
  completionYear?: number;
  note?: string;
  certificate?: ImageAsset;
}
