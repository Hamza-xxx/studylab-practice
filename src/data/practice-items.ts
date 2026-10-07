import type { PracticeItem } from "@/src/lib/practice-items";

export const practiceItems: PracticeItem[] = [
  {
    id: "semantic-profile",
    title: "Make the profile summary semantic",
    description: "Use landmarks, a heading hierarchy, and meaningful link text.",
    status: "ready",
  },
  {
    id: "responsive-navigation",
    title: "Build responsive navigation",
    description: "Keep every action keyboard reachable at narrow widths.",
    status: "in-progress",
  },
  {
    id: "validated-task-form",
    title: "Validate a task form",
    description: "Treat form input as unknown and return accessible errors.",
    status: "review",
  },
];
