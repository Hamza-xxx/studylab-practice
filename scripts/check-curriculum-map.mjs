import { existsSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const CANONICAL_MODULES = new Set([
  "orientation",
  "semantic-html",
  "css-layout",
  "javascript-foundations",
  "git-github",
  "package-tooling",
  "typescript",
  "react",
  "react-data",
  "react-forms",
  "nextjs",
  "server-data-security",
  "quality-ci",
  "responsible-ai",
]);

function expectedSubmission(id, evidence) {
  return {
    target: "learner-fork",
    evidence,
    branchPrefix: `assignment/${id}`,
    requiredChecks: ["Practice quality"],
  };
}

const EXPECTED_ASSIGNMENTS = new Map([
  ["tt-fork-first-pr", {
    moduleId: "git-github",
    tier: "practice",
    path: "assignments/08-first-fork-pr.md",
    submission: expectedSubmission("tt-fork-first-pr", "github-pr"),
  }],
  ["tt-responsive-navbar", {
    moduleId: "react",
    tier: "practice",
    path: "assignments/09-responsive-navbar.md",
    submission: expectedSubmission("tt-responsive-navbar", "github-pr"),
  }],
  ["tt-fix-broken-fetch", {
    moduleId: "react",
    tier: "practice",
    path: "assignments/10-resilient-data-states.md",
    submission: expectedSubmission("tt-fix-broken-fetch", "github-pr"),
  }],
  ["tt-404-page", {
    moduleId: "nextjs",
    tier: "practice",
    path: "assignments/11-app-router-not-found.md",
    submission: expectedSubmission("tt-404-page", "github-pr"),
  }],
  ["tt-deploy-vercel", {
    moduleId: "quality-ci",
    tier: "practice",
    path: "assignments/12-vercel-deployment.md",
    submission: expectedSubmission("tt-deploy-vercel", "github-pr"),
  }],
  ["ms-git-collab", {
    moduleId: "git-github",
    tier: "milestone",
    path: "assignments/01-git-collaboration.md",
    prerequisites: { modules: ["git-github"], approvedTasks: ["tt-fork-first-pr"] },
    submission: expectedSubmission("ms-git-collab", "github-pr"),
  }],
  ["ms-ts-types", {
    moduleId: "typescript",
    tier: "milestone",
    path: "assignments/02-typescript-data-boundary.md",
    submission: expectedSubmission("ms-ts-types", "github-pr"),
  }],
  ["ms-react-ui", {
    moduleId: "react",
    tier: "milestone",
    path: "assignments/03-react-accessible-list.md",
    submission: expectedSubmission("ms-react-ui", "github-pr"),
  }],
  ["ms-next-route", {
    moduleId: "nextjs",
    tier: "milestone",
    path: "assignments/04-next-route-action.md",
    submission: expectedSubmission("ms-next-route", "github-pr"),
  }],
  ["ms-realworld-ci", {
    moduleId: "quality-ci",
    tier: "milestone",
    path: "assignments/05-quality-ci.md",
    submission: expectedSubmission("ms-realworld-ci", "github-pr"),
  }],
  ["ms-ai-workflow", {
    moduleId: "responsible-ai",
    tier: "milestone",
    path: "assignments/06-responsible-ai.md",
    submission: expectedSubmission("ms-ai-workflow", "github-pr"),
  }],
  ["capstone-frontend", {
    moduleId: "quality-ci",
    tier: "capstone",
    path: "assignments/07-capstone.md",
    submission: expectedSubmission("capstone-frontend", "deployment"),
  }],
]);
const NEW_PRACTICE_IDS = new Set(
  [...EXPECTED_ASSIGNMENTS]
    .filter(([, assignment]) => assignment.tier === "practice")
    .map(([id]) => id),
);
const EXPECTED_TIER_COUNTS = [...EXPECTED_ASSIGNMENTS.values()].reduce(
  (counts, assignment) => {
    counts.set(assignment.tier, (counts.get(assignment.tier) ?? 0) + 1);
    return counts;
  },
  new Map(),
);
const REQUIRED_PRACTICE_SECTIONS = [
  "## Objective",
  "## Starter context",
  "## Steps",
  "## Evidence",
  "## Acceptance checks",
  "## Verify",
];

/**
 * Validate a parsed curriculum contract without network access.
 * `root` is injectable so tests can exercise malformed contracts safely.
 */
export function validateCurriculumMap(catalog, root = ROOT) {
  const errors = [];
  const assignments = Array.isArray(catalog?.assignments) ? catalog.assignments : [];
  const modules = Array.isArray(catalog?.modules) ? catalog.modules : [];

  if (catalog?.$schema !== "schemas/curriculum-map.schema.json") {
    errors.push("$schema must reference schemas/curriculum-map.schema.json");
  }
  if (catalog?.version !== "1.1.0") errors.push("version must remain 1.1.0");
  if (catalog?.repository !== "TechArc-io/studylab-practice") {
    errors.push("repository must remain TechArc-io/studylab-practice");
  }
  if (catalog?.pathwayRelease !== "release-foundation-2026") {
    errors.push("pathwayRelease must remain release-foundation-2026");
  }
  if (catalog?.repositoryReleaseTag !== "release-foundation-2026-v2") {
    errors.push("repositoryReleaseTag must remain release-foundation-2026-v2");
  }
  if (new Set(modules).size !== modules.length) errors.push("modules must be unique");
  for (const moduleId of modules) {
    if (!CANONICAL_MODULES.has(moduleId)) errors.push(`unknown module: ${moduleId}`);
  }
  if (modules.length !== CANONICAL_MODULES.size) {
    errors.push(`modules must enumerate all ${CANONICAL_MODULES.size} canonical modules`);
  }
  if (assignments.length !== EXPECTED_ASSIGNMENTS.size) {
    errors.push(`expected exactly ${EXPECTED_ASSIGNMENTS.size} assignments`);
  }

  const ids = new Set();
  const paths = new Set();
  for (const assignment of assignments) {
    const id = assignment?.id;
    if (typeof id !== "string" || !id) {
      errors.push("assignment id must be a non-empty string");
      continue;
    }
    if (ids.has(id)) errors.push(`duplicate assignment id: ${id}`);
    ids.add(id);
    const expected = EXPECTED_ASSIGNMENTS.get(id);
    if (!expected) {
      errors.push(`unknown assignment id: ${id}`);
      continue;
    }
    if (assignment.moduleId !== expected.moduleId) {
      errors.push(`${id} must use canonical module ${expected.moduleId}`);
    }
    if (assignment.tier !== expected.tier) {
      errors.push(`${id} must use tier ${expected.tier}`);
    }
    if (assignment.path !== expected.path) errors.push(`${id} must use path ${expected.path}`);
    if (assignment.submission?.target !== expected.submission.target) {
      errors.push(`${id} must submit to ${expected.submission.target}`);
    }
    if (assignment.submission?.evidence !== expected.submission.evidence) {
      errors.push(`${id} must use ${expected.submission.evidence} evidence`);
    }
    if (assignment.submission?.branchPrefix !== expected.submission.branchPrefix) {
      errors.push(`${id} branch prefix must be ${expected.submission.branchPrefix}`);
    }
    if (
      JSON.stringify(assignment.submission?.requiredChecks) !==
      JSON.stringify(expected.submission.requiredChecks)
    ) {
      errors.push(
        `${id} must require exactly: ${expected.submission.requiredChecks.join(", ")}`,
      );
    }
    const path = assignment.path;
    if (typeof path !== "string" || !isSafeAssignmentPath(path)) {
      errors.push(`${id} has an unsafe assignment path: ${path}`);
      continue;
    }
    if (paths.has(path)) errors.push(`duplicate assignment path: ${path}`);
    paths.add(path);

    const absolutePath = resolve(root, path);
    const assignmentsRoot = resolve(root, "assignments");
    const resolvedRelative = relative(assignmentsRoot, absolutePath);
    if (resolvedRelative.startsWith("..") || isAbsolute(resolvedRelative) || !existsSync(absolutePath)) {
      errors.push(`${id} has a missing assignment path: ${path}`);
      continue;
    }
    if (!lstatSync(absolutePath).isFile()) {
      errors.push(`${id} assignment path must be a regular file: ${path}`);
      continue;
    }
    const realAssignmentsRoot = realpathSync(assignmentsRoot);
    const realAssignmentPath = realpathSync(absolutePath);
    const realRelative = relative(realAssignmentsRoot, realAssignmentPath);
    if (realRelative.startsWith("..") || isAbsolute(realRelative)) {
      errors.push(`${id} assignment path must stay inside assignments/: ${path}`);
      continue;
    }
    const body = readFileSync(absolutePath, "utf8");
    if (!body.includes(`\`${id}\``)) errors.push(`${path} does not declare stable id ${id}`);
    if (!body.includes("docs/git-workflow.md")) errors.push(`${path} must link to the shared Git workflow`);
    if (!body.includes(expected.submission.branchPrefix)) {
      errors.push(`${path} must state branch prefix ${expected.submission.branchPrefix}`);
    }
    if (JSON.stringify(assignment.prerequisites ?? null) !== JSON.stringify(expected.prerequisites ?? null)) {
      errors.push(`${id} prerequisites drift from the release contract`);
    }
    if (id === "ms-git-collab") {
      const fixture = resolve(root, "docs", "collaboration-exercise.md");
      if (!existsSync(fixture) || !lstatSync(fixture).isFile()) {
        errors.push("ms-git-collab requires docs/collaboration-exercise.md");
      }
      if (!body.includes("docs/collaboration-exercise.md")) {
        errors.push("assignments/01-git-collaboration.md must link to the deterministic conflict fixture");
      }
    }
    if (NEW_PRACTICE_IDS.has(id)) {
      for (const section of REQUIRED_PRACTICE_SECTIONS) {
        if (!body.includes(section)) errors.push(`${path} is missing required section ${section}`);
      }
      if (/assignments\/(?:0[1-7])-/u.test(body)) {
        errors.push(`${path} must describe its own practice, not alias a milestone/capstone document`);
      }
    }
  }

  for (const id of EXPECTED_ASSIGNMENTS.keys()) {
    if (!ids.has(id)) errors.push(`missing assignment id: ${id}`);
  }
  const counts = assignments.reduce((result, assignment) => {
    if (assignment?.tier) result[assignment.tier] = (result[assignment.tier] ?? 0) + 1;
    return result;
  }, {});
  for (const [tier, expectedCount] of EXPECTED_TIER_COUNTS) {
    if (counts[tier] !== expectedCount) {
      errors.push(
        `expected ${expectedCount} ${tier} assignments, found ${counts[tier] ?? 0}`,
      );
    }
  }

  for (const assignment of assignments) {
    const id = assignment?.id ?? "unknown";
    const submission = assignment?.submission;
    if (!submission || typeof submission !== "object") {
      errors.push(`${id} must declare a submission contract`);
      continue;
    }
    if (submission.target !== "learner-fork" || !["github-pr", "deployment", "url"].includes(submission.evidence)) {
      errors.push(`${id} has an unsupported evidence/target combination`);
    }
    if (submission.branchPrefix !== `assignment/${id}`) {
      errors.push(`${id} must declare branch prefix assignment/${id}`);
    }
    if (!Array.isArray(submission.requiredChecks) || submission.requiredChecks.length === 0 || submission.requiredChecks.some((check) => typeof check !== "string" || !check.trim())) {
      errors.push(`${id} must declare non-empty required checks`);
    } else if (!submission.requiredChecks.includes("Practice quality")) {
      errors.push(`${id} must require the Practice quality check`);
    }
  }
  return errors;
}

function isSafeAssignmentPath(path) {
  return path.startsWith("assignments/") &&
    !path.includes("\\") &&
    !path.includes("\0") &&
    !path.split("/").some((segment) => segment === ".." || segment === ".") &&
    path === path.replaceAll("//", "/");
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1] ?? "")).href) {
  const catalog = JSON.parse(readFileSync(resolve(ROOT, "curriculum-map.json"), "utf8"));
  const errors = validateCurriculumMap(catalog, ROOT);
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }
  const tierSummary = [...EXPECTED_TIER_COUNTS]
    .map(([tier, count]) => `${count} ${tier}`)
    .join(", ");
  console.log(
    `✓ curriculum map: ${catalog.assignments.length} stable assignments aligned (${tierSummary})`,
  );
}
