import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import catalog from "../curriculum-map.json";

// The validator is intentionally a small Node script used by CI. It has no
// TypeScript source counterpart because it must remain runnable before build.
// @ts-expect-error The repository does not publish declarations for .mjs tools.
import { validateCurriculumMap } from "../scripts/check-curriculum-map.mjs";

const temporaryRoots: string[] = [];

function createTemporaryRoot(): string {
  const root = mkdtempSync(join(tmpdir(), "studylab-practice-contract-"));
  cpSync(join(process.cwd(), "assignments"), join(root, "assignments"), {
    recursive: true,
  });
  temporaryRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("curriculum-map contract", () => {
  it("accepts the complete twelve-assignment release contract", () => {
    expect(validateCurriculumMap(catalog)).toEqual([]);
    expect(catalog.version).toBe("1.1.0");
    expect(catalog.pathwayRelease).toBe("release-foundation-2026");
    expect(catalog.repositoryReleaseTag).toBe("release-foundation-2026-v2");
    expect(catalog.assignments).toHaveLength(12);
    expect(catalog.assignments.filter((assignment) => assignment.tier === "practice")).toHaveLength(5);
    expect(catalog.assignments.filter((assignment) => assignment.tier === "milestone")).toHaveLength(6);
    expect(catalog.assignments.filter((assignment) => assignment.tier === "capstone")).toHaveLength(1);
  });

  it("uses the shared assignment branch format in every assignment brief", () => {
    for (const assignment of catalog.assignments) {
      const source = readFileSync(join(process.cwd(), assignment.path), "utf8");
      expect(assignment.submission.branchPrefix, assignment.id).toBe(`assignment/${assignment.id}`);
      expect(source, assignment.id).toContain(assignment.submission.branchPrefix);
    }
  });

  it("makes collaboration a distinct, prerequisite-backed conflict exercise", () => {
    const collaboration = catalog.assignments.find((assignment) => assignment.id === "ms-git-collab");
    expect(collaboration?.prerequisites).toEqual({
      modules: ["git-github"],
      approvedTasks: ["tt-fork-first-pr"],
    });
    expect(readFileSync(join(process.cwd(), "assignments/01-git-collaboration.md"), "utf8"))
      .toContain("docs/collaboration-exercise.md");
    expect(readFileSync(join(process.cwd(), "docs/collaboration-exercise.md"), "utf8"))
      .toContain("Shared status:");
  });

  it("lists every assignment as an unchecked personal tracker item", () => {
    const index = readFileSync(join(process.cwd(), "assignments", "README.md"), "utf8");
    expect(index).toContain("| Status | ID | Assignment | Evidence |");
    expect(index).toContain("replace that assignment's `- [ ]` with `- [x]`");
    for (const assignment of catalog.assignments) {
      expect(index, assignment.id).toContain(`| - [ ] | \`${assignment.id}\` |`);
    }
  });

  it("rejects duplicate ids and paths, unknown modules, and unsupported submissions", () => {
    const malformed = structuredClone(catalog);
    malformed.assignments[1].id = malformed.assignments[0].id;
    malformed.assignments[1].path = malformed.assignments[0].path;
    malformed.assignments[1].moduleId = "retired-module";
    malformed.assignments[1].submission = { target: "official-repository", evidence: "url", branchPrefix: "feature/wrong", requiredChecks: [] };

    const errors = validateCurriculumMap(malformed);
    expect(errors).toEqual(expect.arrayContaining([
      "duplicate assignment id: tt-fork-first-pr",
      "duplicate assignment path: assignments/08-first-fork-pr.md",
      "tt-fork-first-pr must use canonical module git-github",
      "tt-fork-first-pr has an unsupported evidence/target combination",
      "tt-fork-first-pr must declare branch prefix assignment/tt-fork-first-pr",
      "tt-fork-first-pr must declare non-empty required checks",
    ]));
  });

  it("rejects unsafe traversal and path drift", () => {
    const malformed = structuredClone(catalog);
    malformed.assignments[0].path = "assignments/../README.md";

    const errors = validateCurriculumMap(malformed);
    expect(errors).toContain("tt-fork-first-pr must use path assignments/08-first-fork-pr.md");
    expect(errors).toContain("tt-fork-first-pr has an unsafe assignment path: assignments/../README.md");
  });

  it.each([
    ["tt-responsive-navbar", "deployment", "tt-responsive-navbar must use github-pr evidence"],
    ["ms-ts-types", "url", "ms-ts-types must use github-pr evidence"],
    ["capstone-frontend", "github-pr", "capstone-frontend must use deployment evidence"],
  ])("enforces the canonical evidence for %s", (id, evidence, expectedError) => {
    const malformed = structuredClone(catalog);
    const assignment = malformed.assignments.find((candidate) => candidate.id === id);
    expect(assignment).toBeDefined();
    if (!assignment) return;

    assignment.submission.evidence = evidence;

    expect(validateCurriculumMap(malformed)).toContain(expectedError);
  });

  it("requires the exact automated checks while deployment stays evidence", () => {
    const malformed = structuredClone(catalog);
    const capstone = malformed.assignments.find((assignment) => assignment.id === "capstone-frontend");
    expect(capstone).toBeDefined();
    if (!capstone) return;

    capstone.submission.requiredChecks = [
      "Practice quality",
      "Deployment smoke test",
    ];

    expect(validateCurriculumMap(malformed)).toContain(
      "capstone-frontend must require exactly: Practice quality",
    );
  });

  it("rejects missing files, directories, and symlink escapes", () => {
    const missingRoot = createTemporaryRoot();
    unlinkSync(join(missingRoot, "assignments/08-first-fork-pr.md"));
    expect(validateCurriculumMap(catalog, missingRoot)).toContain(
      "tt-fork-first-pr has a missing assignment path: assignments/08-first-fork-pr.md",
    );

    const directoryRoot = createTemporaryRoot();
    const directoryPath = join(directoryRoot, "assignments/08-first-fork-pr.md");
    unlinkSync(directoryPath);
    mkdirSync(directoryPath);
    expect(validateCurriculumMap(catalog, directoryRoot)).toContain(
      "tt-fork-first-pr assignment path must be a regular file: assignments/08-first-fork-pr.md",
    );

    const symlinkRoot = createTemporaryRoot();
    const symlinkPath = join(symlinkRoot, "assignments/08-first-fork-pr.md");
    const outsidePath = join(symlinkRoot, "outside.md");
    writeFileSync(outsidePath, readFileSync(symlinkPath));
    unlinkSync(symlinkPath);
    symlinkSync("../outside.md", symlinkPath);
    expect(validateCurriculumMap(catalog, symlinkRoot)).toContain(
      "tt-fork-first-pr assignment path must be a regular file: assignments/08-first-fork-pr.md",
    );
  });

  it("rejects incomplete practice documents and milestone aliases", () => {
    const root = createTemporaryRoot();
    const assignmentPath = join(root, "assignments/08-first-fork-pr.md");
    const body = readFileSync(assignmentPath, "utf8")
      .replace("`tt-fork-first-pr`", "`wrong-id`")
      .replaceAll("docs/git-workflow.md", "docs/other.md")
      .replace("## Verify", "## Commands");
    writeFileSync(
      assignmentPath,
      `${body}\nAlias: assignments/01-git-collaboration.md\n`,
    );

    expect(validateCurriculumMap(catalog, root)).toEqual(expect.arrayContaining([
      "assignments/08-first-fork-pr.md does not declare stable id tt-fork-first-pr",
      "assignments/08-first-fork-pr.md must link to the shared Git workflow",
      "assignments/08-first-fork-pr.md is missing required section ## Verify",
      "assignments/08-first-fork-pr.md must describe its own practice, not alias a milestone/capstone document",
    ]));
  });
});
