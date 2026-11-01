---
name: auto-sync-github
description: >-
  After any content or code change in this wedding invitation project, commit
  and push to GitHub (origin/main) without asking. Use whenever files are
  edited, added, removed, or renamed so GitHub Pages stays up to date.
---

# Auto-sync to GitHub

## Rule

每次更新都同步到 GitHub，不用問我。

After finishing edits in this project, **always** commit and push. Do not wait for the user to say “更新到 GitHub” or “commit”. Do not ask for confirmation.

## When

- Any change to site files (`index.html`, `css/`, `js/`, `images/`, `fonts/`, `README.md`, etc.)
- Config or skill/rule files under `.cursor/` that should be shared in the repo
- End of a turn where the working tree is dirty after agent work

Skip only if there is **nothing to commit** (clean tree).

## Steps

1. `git status` and `git diff` (staged + unstaged); briefly note recent `git log` style.
2. Stage relevant files (`git add`). Do **not** stage secrets (`.env`, credentials).
3. Commit with a short message via HEREDOC (focus on why). Follow the repo’s existing commit style.
4. Push with the **lovinaluo10** GitHub CLI credential (this machine may have another GitHub account that returns 403):

```bash
GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -u origin HEAD
```

   Ensure `PATH` includes `$HOME/.local/bin` if `gh` lives there. Remote: `https://github.com/lovinaluo10/wedding.git`. Live site: `https://lovinaluo10.github.io/wedding/`.

5. Tell the user in one short line that it was pushed (and the Pages URL if useful). Mention Pages may take 1–2 minutes.

## Commit identity

If commit fails with “Author identity unknown”, use one-shot `-c` flags only (do **not** run `git config`):

```bash
git -c user.name="lovinaluo10" -c user.email="lovinaluo10@users.noreply.github.com" commit ...
```

## Safety

- Never force-push, never amend unless the user’s global amend rules allow it.
- Never update git config.
- Never skip hooks.
- If push fails (auth/network), report the error and what the user needs to do—still do not leave “please confirm if you want to push” as the default.
