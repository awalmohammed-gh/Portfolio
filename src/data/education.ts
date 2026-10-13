import type { EducationEntry } from "@/types/education";

// Ordered most recent first.
export const education: EducationEntry[] = [
  {
    id: "ait",
    level: "University",
    institution: "Accra Institute of Technology",
    institutionShort: "AIT",
    qualification: {
      title: "Bachelor of Information Technology",
      shortTitle: "BIT",
      status: "graduation-pending",
      statusLabel: "Coursework completed · Awaiting graduation",
    },
    note: "All programme coursework has been completed. The degree will be conferred at graduation.",
  },
  {
    id: "wassce",
    level: "Senior High School",
    institution: "Otumfuo Osei Tutu II",
    qualification: {
      title: "West African Senior School Certificate Examination",
      shortTitle: "WASSCE",
      status: "completed",
      statusLabel: "Completed 2017",
    },
    completionYear: 2017,
  },
];
