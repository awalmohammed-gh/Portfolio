export type QualificationStatus = "completed" | "graduation-pending";

export interface Qualification {
  title: string;
  shortTitle: string;
  status: QualificationStatus;
  /** Human-readable status, e.g. "Completed 2017". Never claims an award that isn't confirmed. */
  statusLabel: string;
}

export interface EducationEntry {
  id: string;
  level: "Senior High School" | "University";
  institution: string;
  institutionShort?: string;
  qualification: Qualification;
  /** Only set when the year is confirmed. */
  completionYear?: number;
  note?: string;
}
