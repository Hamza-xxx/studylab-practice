# Astudylab Practice

The official public practice workspace for the [Astudylab](https://astudylab.com) frontend learning path.

This repository is designed to be forked once and improved throughout the curriculum. Each assignment adds evidence to the same GitHub history: focused branches, reviewed pull requests, tests, and a final deployed capstone.

## Start here

1. Install Node.js 24 and Git.
2. Fork this repository to your GitHub account. Do not push to the upstream repository.
3. Clone your fork and configure the upstream remote:

   ```bash
   git clone https://github.com/YOUR-USERNAME/studylab-practice.git
   cd studylab-practice
   git remote add upstream https://github.com/TechArc-io/studylab-practice.git
   npm ci
   npm run check
   ```

4. Open the assignment linked from your Astudylab task.
5. Create one branch per assignment, make the change, run the required checks, and open a pull request into `main` **inside your fork**.
6. Wait until the `Practice quality` check passes, then request mentor review. After your pull request is approved, paste its URL into Astudylab and merge it into your fork.

The canonical `TechArc-io/studylab-practice` repository stays a clean starting point. Your fork is your cumulative learning record; assignments are not merged into the canonical repository.

## Learning workspace

| Area | Purpose |
| --- | --- |
| [`foundations/`](foundations/) | Semantic HTML, CSS, JavaScript, accessibility, and browser debugging without framework noise. |
| [`app/`](app/) | Next.js App Router pages used by the React, routing, data, and capstone assignments. |
| [`src/`](src/) | Typed components, data boundaries, validation, and reusable domain code. |
| [`tests/`](tests/) | Unit and component safety nets learners expand during the pathway. |
| [`assignments/`](assignments/) | Stable task contracts aligned with Astudylab milestone IDs. |
| [`docs/`](docs/) | Setup, Git workflow, review expectations, and architecture guidance. |

Read [CURRICULUM.md](CURRICULUM.md) for the progression and [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Commands

```bash
npm run dev        # local Next.js development server
npm run lint       # zero-warning lint
npm run typecheck  # TypeScript verification
npm run check:catalog # curriculum/assignment contract verification
npm test           # unit and component tests
npm run build      # production build
npm run check      # complete local quality gate
```

## Evidence, not shortcuts

Your fork and pull requests are part of your learning record. Keep commits understandable, describe what you verified, and explain decisions in your own words. AI assistance is allowed only when the assignment permits it; you remain responsible for every submitted line.
