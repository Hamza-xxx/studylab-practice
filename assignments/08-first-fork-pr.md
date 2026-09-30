# `tt-fork-first-pr` — Make your first focused pull request

Follow the shared [`docs/git-workflow.md`](../docs/git-workflow.md) and submit the reviewed PR from your fork in Astudylab.

## Objective

Practice the smallest complete GitHub contribution: fork the repository, create a task branch, make one useful change, and provide reviewable evidence.

## Starter context

The starter workspace is already runnable. Choose one unclear sentence in `README.md`, `docs/setup.md`, or `foundations/README.md`; preserve its meaning while making it easier for a new learner to follow.

## Steps

1. Fork `TechArc-io/studylab-practice` and clone your fork.
2. Synchronize `main`, then create a branch beginning with `assignment/tt-fork-first-pr` (for example, `assignment/tt-fork-first-pr-clarify-setup`).
3. Make one focused documentation improvement and inspect the diff.
4. Run the verification commands, commit with a descriptive message, and push the branch.
5. Open a pull request into `main` in your fork, add the verification output, and request review.

## Evidence

Submit the pull-request URL, the branch name, and a short before/after explanation. Include the output of `git diff --check` and `npm run build` in the PR description.

## Acceptance checks

- The branch starts with `assignment/tt-fork-first-pr`, and the change is not made directly on `main`.
- The diff is focused, keeps the original meaning, and contains no conflict markers or secrets.
- The PR targets `main`, explains the change, and includes reproducible verification evidence.

## Verify

```bash
git status
git diff --check main...HEAD
npm ci
npm run build
```

## Explain in your PR

What did you change, how did you confirm it was safe, and what would you ask a reviewer to check first?
