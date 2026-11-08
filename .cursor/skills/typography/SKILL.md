---
name: typography
description: >-
  Wedding invite type rules: ceremonial copy uses 辰宇落雁; tool/action UI uses
  匯文港黑. Use when editing fonts, buttons, CTAs, forms, VIP pass, or site CSS.
---

# Typography

## Fonts

| CSS var | Face | Role |
|---------|------|------|
| `--font` | 匯文港黑（fallback Noto Serif TC） | Default body + **all tool / action UI** |
| `--font-card` | 辰宇落雁 | Ceremonial card copy only (VIP pass titles, names, venue lines, WITH LOVE thanks) |

## Rule

偏工具的字都採用匯文港黑體。

Examples that must stay `--font` / 匯文港黑:

- Buttons and links acting as buttons (`.gold-btn`, `.text-btn`, transit / skip / modal controls)
- Form labels, inputs, selects, RSVP options, submit
- Utility labels (Google 日曆、交通指引、仔細查看、送出賓客登記, etc.)
- Error / helper microcopy tied to actions

Do **not** force `--font-card` onto buttons inside `.vip-pass` or other cards.

## When editing

1. New CTA / control → `var(--font)` unless the user explicitly asks for ceremonial type.
2. VIP / invite poetic lines → `--font-card` is fine; keep adjacent CTAs on `--font`.
3. After font CSS changes, bump the `styles.css?v=` query on `index.html`.
