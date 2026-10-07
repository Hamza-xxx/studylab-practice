import { describe, expect, it } from "vitest";

// The production contract is a dependency-free Node CLI; test its exported
// pure validator without introducing a separate build step for scripts.
// @ts-expect-error The checked JavaScript CLI intentionally has no declaration file.
import { validatePullRequest } from "../scripts/check-pr-contract.mjs";

describe("learner pull-request contract", () => {
  it("accepts an assignment branch, matching title, and fork main target", () => {
    expect(
      validatePullRequest({
        title: "[ms-react-ui] Build accessible list",
        headRef: "assignment/ms-react-ui-accessible-list",
        baseRef: "main",
      }),
    ).toEqual([]);
  });

  it("rejects work that cannot be mapped to an Astudylab assignment", () => {
    expect(
      validatePullRequest({
        title: "Build accessible list",
        headRef: "feature/list",
        baseRef: "main",
      }),
    ).toHaveLength(1);
  });

  it("requires the stable assignment id in the title", () => {
    expect(
      validatePullRequest({
        title: "Build accessible list",
        headRef: "assignment/ms-react-ui-accessible-list",
        baseRef: "main",
      }),
    ).toContain("PR title must include [ms-react-ui].");
  });

  it("requires the pull request to target main", () => {
    expect(
      validatePullRequest({
        title: "[ms-react-ui] Build accessible list",
        headRef: "assignment/ms-react-ui-accessible-list",
        baseRef: "develop",
      }),
    ).toContain("Learner pull requests must target main in your own fork.");
  });

  it("uses the declared branch prefix as the machine contract", () => {
    expect(
      validatePullRequest({
        title: "[tt-fork-first-pr] Clarify setup",
        headRef: "assignment/tt-fork-first-pr-clarify-setup",
        baseRef: "main",
      }),
    ).toEqual([]);
  });
});
