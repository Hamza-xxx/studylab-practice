import { describe, expect, it } from "vitest";
import { getPracticeById } from "@/app/lib/practice";

describe("getPracticeById", () => {
  it("returns a practice for a valid ID", () => {
    const item = getPracticeById("semantic-profile");

    expect(item).toBeDefined();
    expect(item?.id).toBe("semantic-profile");
  });

  it("returns undefined for an unknown ID", () => {
    expect(getPracticeById("unknown-id")).toBeUndefined();
  });
});