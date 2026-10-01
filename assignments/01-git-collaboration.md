# `ms-git-collab` — Collaborate through a reviewed pull request

**Outcome:** demonstrate a safe fork, branch, commit, synchronization, and review workflow.

## Scenario

Two contributors have edited the same status line in [`docs/collaboration-exercise.md`](../docs/collaboration-exercise.md). Reproduce that conflict locally, resolve it without losing either contributor's intent, and then respond to review with a separate follow-up commit.

## Steps

1. Synchronize your fork using `docs/git-workflow.md`.
2. From updated `main`, create a temporary branch named `exercise/ms-git-collab-peer`. Change the `Shared status:` line to describe the simulated peer's verification preference, then commit it.
3. Return to `main` and create a branch beginning with `assignment/ms-git-collab` (for example, `assignment/ms-git-collab-preserve-both`). Change that same `Shared status:` line to describe your own preference, then commit it.
4. Merge `exercise/ms-git-collab-peer` into the assignment branch. Git must stop on the shared line. Resolve it by writing one clear sentence that preserves both verification preferences, remove every conflict marker, and commit the resolution.
5. Run the verification commands and open a pull request into `main` in your fork, following [`docs/git-workflow.md`](../docs/git-workflow.md).
6. Ask your mentor to review the PR. Address at least one review comment with a new follow-up commit on the same assignment branch.

## Acceptance checks

- The assignment branch starts with `assignment/ms-git-collab`; neither exercise edit is made directly on `main`.
- The history contains distinct exercise edits, a conflict-resolution commit, and a later review-response commit.
- `docs/collaboration-exercise.md` contains no conflict markers and preserves both intended verification preferences.
- The PR targets `main` in your fork and explains the conflict, resolution, follow-up review change, and verification.

## Verify

```bash
git status
git log --oneline -5
git diff --check main...HEAD
npm ci
npm run build
```

## Explain in your PR

What caused the conflict? How did you decide which content to keep? What would make the same conflict less likely on a real team?
