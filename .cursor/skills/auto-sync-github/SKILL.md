---
name: auto-sync-github
description: >-
  Preview wedding invitation changes locally first; only commit and push to
  GitHub after the user confirms. Use when editing site files or when the user
  asks to publish, deploy, sync, or push updates.
---

# Preview first, push after confirm

## Rule

所有更新都先在 Cursor 內修改預覽，待確認沒問題，經詢問再推上 GitHub。

## Default workflow

1. Make the requested edits in the project.
2. Help the user **preview locally** (open `index.html`, or `python3 -m http.server` in the project root). Do **not** commit or push in the same turn unless they already asked to publish.
3. When the work for that request is done, **ask** whether to push to GitHub (e.g. 「預覽沒問題的話，要推上 GitHub 嗎？」).
4. Only after an explicit yes / 「推上 GitHub」 / 「更新線上」／類似確認 → run commit + push.

## When the user confirms push

1. `git status` and `git diff`; glance at recent `git log` style.
2. Stage relevant files. Do **not** stage secrets (`.env`, credentials).
3. Commit with a short HEREDOC message (why, not only what). If author identity is missing, use one-shot `-c` only—never `git config`:

```bash
git -c user.name="lovinaluo10" -c user.email="lovinaluo10@users.noreply.github.com" commit -m "$(cat <<'EOF'
Message here.

EOF
)"
```

4. Push with the **lovinaluo10** GitHub CLI credential (`PATH` may need `$HOME/.local/bin`):

```bash
GIT_TERMINAL_PROMPT=0 git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -u origin HEAD
```

5. Confirm briefly; live site: `https://lovinaluo10.github.io/wedding/` (Pages ~1–2 min).

## Safety

- Never force-push; never amend unless global amend rules allow it.
- Never update git config; never skip hooks.
- If the tree is clean when they ask to push, say so—do not create an empty commit.
