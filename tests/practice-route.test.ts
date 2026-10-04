import { describe, expect, it } from "vitest";
import {
  completePracticeForUser,
  createPracticeForUser,
  getPracticeByIdForUser,
  getPracticesForUser,
  updatePracticeForUser,
} from "@/app/lib/practice";

describe("getPracticeByIdForUser", () => {
  it("returns a practice when it belongs to the current user", () => {
    const item = getPracticeByIdForUser(
      "semantic-profile",
      "demo-learner",
    );

    expect(item).toBeDefined();
    expect(item?.id).toBe("semantic-profile");
    expect(item?.userId).toBe("demo-learner");
  });

  it("returns undefined when the practice belongs to another user", () => {
    const item = getPracticeByIdForUser(
      "semantic-profile",
      "another-user",
    );

    expect(item).toBeUndefined();
  });

  it("returns undefined for an unknown practice id", () => {
    const item = getPracticeByIdForUser(
      "unknown-id",
      "demo-learner",
    );

    expect(item).toBeUndefined();
  });
});

describe("createPracticeForUser", () => {
  it("creates a practice scoped to the supplied user", () => {
    const userId = "create-test-user";

    const created = createPracticeForUser(userId, {
      title: "Learn Docker basics",
      description: "Practice Docker containers for cloud deployment.",
    });

    expect(created.userId).toBe(userId);
    expect(created.title).toBe("Learn Docker basics");
    expect(created.status).toBe("ready");
    expect(created.completed).toBe(false);

    const userPractices = getPracticesForUser(userId);

    expect(
      userPractices.some((practice) => practice.id === created.id),
    ).toBe(true);

    expect(
      getPracticeByIdForUser(created.id, "another-user"),
    ).toBeUndefined();
  });
});

describe("completePracticeForUser", () => {
  it("marks the practice as completed for its owner", () => {
    const userId = "complete-test-user";

    const created = createPracticeForUser(userId, {
      title: "Practice Next.js",
      description: "Practice Server Actions and App Router boundaries.",
    });

    expect(created.completed).toBe(false);

    const completed = completePracticeForUser(
      created.id,
      userId,
    );

    expect(completed).toBeDefined();
    expect(completed?.completed).toBe(true);
  });

  it("does not complete a practice for another user", () => {
    const ownerId = "practice-owner";
    const anotherUserId = "another-user";

    const created = createPracticeForUser(ownerId, {
      title: "Protected practice",
      description: "This practice belongs only to the original owner.",
    });

    const result = completePracticeForUser(
      created.id,
      anotherUserId,
    );

    expect(result).toBeUndefined();

    const original = getPracticeByIdForUser(
      created.id,
      ownerId,
    );

    expect(original?.completed).toBe(false);
  });
});

describe("updatePracticeForUser", () => {
  it("updates a practice for its owner", () => {
    const userId = "update-test-user";

    const created = createPracticeForUser(userId, {
      title: "Original title",
      description: "This is the original practice description.",
    });

    const updated = updatePracticeForUser(
      created.id,
      userId,
      {
        title: "Updated title",
        description: "This is the updated practice description.",
      },
    );

    expect(updated).toBeDefined();
    expect(updated?.title).toBe("Updated title");
    expect(updated?.description).toBe(
      "This is the updated practice description.",
    );
  });

  it("does not update a practice for another user", () => {
    const ownerId = "update-owner";
    const anotherUserId = "another-user";

    const created = createPracticeForUser(ownerId, {
      title: "Owner title",
      description: "This practice belongs to the original owner.",
    });

    const result = updatePracticeForUser(
      created.id,
      anotherUserId,
      {
        title: "Hacked title",
        description: "Another user tried to change this practice.",
      },
    );

    expect(result).toBeUndefined();

    const original = getPracticeByIdForUser(
      created.id,
      ownerId,
    );

    expect(original?.title).toBe("Owner title");
    expect(original?.description).toBe(
      "This practice belongs to the original owner.",
    );
  });
});