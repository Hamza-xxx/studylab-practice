import { describe, expect, it } from "vitest";
import { parsePracticeItems } from "@/src/lib/practice-items";

describe("parsePracticeItems", () => {
  it("accepts valid practice items", () => {
    const result = parsePracticeItems([
      {
        id: "semantic-profile",
        title: "Make the profile summary semantic",
        description: "Use landmarks and meaningful link text.",
        status: "ready",
      },
    ]);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual([
        {
          id: "semantic-profile",
          title: "Make the profile summary semantic",
          description: "Use landmarks and meaningful link text.",
          status: "ready",
        },
      ]);
    }
  });

  it("rejects an item with a missing field", () => {
    const result = parsePracticeItems([
      {
        id: "semantic-profile",
        title: "Make the profile summary semantic",
        status: "ready",
      },
    ]);

    expect(result.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    const result = parsePracticeItems([
      {
        id: "semantic-profile",
        title: "Make the profile summary semantic",
        description: "Use landmarks and meaningful link text.",
        status: "completed",
      },
    ]);

    expect(result.success).toBe(false);
  });

  it("rejects unexpected extra values", () => {
    const result = parsePracticeItems([
      {
        id: "semantic-profile",
        title: "Make the profile summary semantic",
        description: "Use landmarks and meaningful link text.",
        status: "ready",
        priority: "high",
      },
    ]);

    expect(result.success).toBe(false);
  });
});