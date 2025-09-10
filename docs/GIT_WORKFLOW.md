# Git workflow: branch from `master` and resolve PR conflicts by rebasing

This short guide explains the recommended local workflow for creating feature branches from `master`, opening a Pull Request (PR), and resolving merge conflicts by rebasing onto the latest `master` branch so your PR can be merged cleanly.

Keep these goals in mind:

- Start every feature/fix branch from an up-to-date `master`.
- Keep your branch synchronized with `master` while you work.
- If a PR shows merge conflicts, rebase your branch onto the latest `master`, resolve conflicts locally, and force-push the branch so the PR can be merged without extra merge commits.

---

## 1) Create your branch (from fresh `master`)

Always fetch and update `master` before branching.

```bash
# fetch remote changes
git fetch origin

# switch to master and update it
git checkout master
git pull origin master

# create a new feature branch
git checkout -b feat/your-short-description
```

Notes:

- Use a short, descriptive branch name like `feat/login-button`, `fix/api-timeout`, or `chore/update-deps`.
- If your repo uses `main` instead of `master`, substitute that name.

## 2) Work normally, commit and push

Make incremental commits locally. When ready, push your branch to the remote:

```bash
git add -A
git commit -m "feat: add login button"
git push -u origin feat/your-short-description
```

Open a PR from your branch into `master` (or the repo's default branch). Add reviewers and CI will run.

## 3) Keep your branch up to date during development

If `master` advances while your PR is open, pull the latest `master` into your branch frequently. We recommend rebasing rather than merging to keep history linear.

Preferred (rebase) approach:

```bash
# update local master
git checkout master
git pull origin master

# go back to your branch
git checkout feat/your-short-description

# rebase onto master
git rebase master

# if there are conflicts, resolve them in your editor, then:
git add <resolved-files>
git rebase --continue

# once rebase finishes, run tests/lint, then force-push your branch
git push --force-with-lease origin feat/your-short-description
```

Why `--force-with-lease`?

- It is safer than `--force` because it checks the remote hasn't changed unexpectedly.

Alternative (merge) approach:

```bash
git checkout master
git pull origin master
git checkout feat/your-short-description
git merge master
# resolve conflicts, commit, and push normally
git push origin feat/your-short-description
```

Merging creates merge commits; many teams prefer rebasing for a cleaner history.

## 4) Handling merge conflicts when the PR shows conflicts

If the PR UI shows conflicts or the repo blocks merge, rebase your branch onto the latest `master` locally and resolve conflicts:

1. Fetch and update `master`:

```bash
git fetch origin
git checkout master
git pull origin master
```

2. Rebase your branch onto master:

```bash
git checkout feat/your-short-description
git rebase master
```

3. Resolve conflicts in each file (edit, test). For each resolved file:

```bash
git add path/to/resolved-file
git rebase --continue
```

4. If you want to abort the rebase and return to the pre-rebase branch state:

```bash
git rebase --abort
```

5. After successfully rebasing and running tests/lint locally, push your branch with:

```bash
git push --force-with-lease origin feat/your-short-description
```

The PR will update automatically. Confirm the PR passes CI and that conflicts are resolved.

## 5) Safety and etiquette

- Do not rebase public/shared branches that others are actively working on without coordinating first.
- Prefer `--force-with-lease` over `--force` to reduce the chance of overwriting others' work.
- Run the project's tests and linters locally before pushing after a rebase.
- If a rebase is complex, consider communicating on the PR and pushing a short-lived `wip/` branch as a backup.

## 6) Quick troubleshooting

- Rebase stops with an unexpected conflict and you want to abort:

```bash
git rebase --abort
```

- You rebased and forgot to push, but the remote has new commits: re-run `git pull --rebase` on `master` and then rebase again, or coordinate with teammates.

- To inspect the rebase state:

```bash
git status
git log --oneline --graph --decorate -n 20
```

## 7) Example full flow (copyable)

```bash
# start from updated master
git fetch origin
git checkout master
git pull origin master

# create feature branch
git checkout -b feat/new-widget

# do work, commit, push
git add -A
git commit -m "feat(widget): add new widget"
git push -u origin feat/new-widget

# open PR on GitHub targeting master

# later, master advanced and PR shows conflicts -> rebase
git checkout master
git pull origin master
git checkout feat/new-widget
git rebase master
# resolve conflicts, run tests
git push --force-with-lease origin feat/new-widget
```

---

If you'd like, I can also add a short checklist file that runs locally (shell script) to automate the common rebase steps, or add a CI job that enforces no-merge conflicts on PRs. Let me know which you prefer.
