export type PracticeStatus = "ready" | "in-progress" | "review";

export type PracticeItem = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: PracticeStatus;
  completed: boolean;
};

export const practiceItems: PracticeItem[] = [
  {
    id: "semantic-profile",
    userId: "demo-learner",
    title: "Make the profile summary semantic",
    description: "Use landmarks, a heading hierarchy, and meaningful link text.",
    status: "ready",
    completed: false,
  },
  {
    id: "responsive-navigation",
    userId: "demo-learner",
    title: "Build responsive navigation",
    description: "Keep every action keyboard reachable at narrow widths.",
    status: "in-progress",
    completed: false,
  },
  {
    id: "validated-task-form",
    userId: "demo-learner",
    title: "Validate a task form",
    description: "Treat form input as unknown and return accessible errors.",
    status: "review",
    completed: true,
  },
];