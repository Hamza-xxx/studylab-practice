import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const catalog = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "..", "curriculum-map.json"), "utf8"),
);

export function validatePullRequest({ title, headRef, baseRef }) {
  const errors = [];
  const assignment = catalog.assignments.find(
    ({ id, submission }) => title.includes(`[${id}]`) || headRef === submission.branchPrefix || headRef.startsWith(`${submission.branchPrefix}-`),
  );

  if (!assignment) {
    errors.push("Use an assignment branch such as assignment/ms-react-ui-short-description and include [ms-react-ui] in the PR title.");
    return errors;
  }
  if (baseRef !== "main") {
    errors.push("Learner pull requests must target main in your own fork.");
  }
  if (!(headRef === assignment.submission.branchPrefix || headRef.startsWith(`${assignment.submission.branchPrefix}-`))) {
    errors.push(`Branch must start with ${assignment.submission.branchPrefix}.`);
  }
  if (!title.includes(`[${assignment.id}]`)) {
    errors.push(`PR title must include [${assignment.id}].`);
  }
  return errors;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const errors = validatePullRequest({
    title: process.env.PR_TITLE ?? "",
    headRef: process.env.PR_HEAD_REF ?? "",
    baseRef: process.env.PR_BASE_REF ?? "",
  });

  if (errors.length > 0) {
    console.error(errors.map((error) => `- ${error}`).join("\n"));
    process.exit(1);
  }

  console.log("✓ learner pull-request contract is valid");
}
