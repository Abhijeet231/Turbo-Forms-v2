# Form Builder Design System

## Theme
Premium dark-mode SaaS UI with retro-modern aesthetics.

Inspired by:
- Vintage computers
- Terminal UIs
- Minimal dashboards
- Modern SaaS products

The UI should feel:
- Clean
- Premium
- Calm
- High contrast
- Warm toned
- Minimal but not empty

---

## Color Palette

| Role | Color |
|---|---|
| Background | #111111 |
| Surface/Card | #1F1F1F |
| Primary Accent | #DCC9A9 |
| Success Accent | #4E6851 |
| Danger Accent | #B83A2D |
| Border | #2A2A2A |
| Primary Text | #F5F5F5 |
| Secondary Text | #A1A1AA |

---

## Color Usage Rules

- Beige (#DCC9A9) is the primary accent color
- Green (#4E6851) should be subtle and secondary
- Red (#B83A2D) should only be used for:
  - destructive actions
  - warnings
  - validation errors

Avoid:
- oversaturated colors
- random Tailwind colors
- bright gradients

---

## UI Rules

- Use thin borders
- Prefer rounded-2xl cards
- Use soft shadows
- Maintain generous spacing
- Prefer minimal layouts
- Keep interfaces clean and uncluttered
- Prioritize readability
- Use hover states subtly
- Avoid excessive animations

---

## Tailwind Rules

Use semantic Tailwind classes:

- bg-background
- bg-surface
- text-text-primary
- text-text-secondary
- border-border
- text-primary
- bg-primary
- bg-success
- bg-danger

Avoid:
- raw zinc/gray/slate classes unless necessary
- inconsistent spacing
- random border radius values

---

## Component Philosophy

Buttons:
- Primary buttons use beige
- Secondary buttons use surface colors with borders
- Danger buttons use muted red

Cards:
- Rounded-2xl
- Thin borders
- Slightly elevated from background

Inputs:
- Dark surfaces
- Thin borders
- Beige focus rings

Modals:
- Slightly brighter than background
- Soft shadow
- Minimal distractions

Sidebar:
- Dark and minimal
- Active item uses subtle beige highlighting

---

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Zustand