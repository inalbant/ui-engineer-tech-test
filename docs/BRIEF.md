# Yantra UI engineering test

**Time budget: 2.5 hours.** There are three parts. Work through them in order. We are assessing quality of work over quantity / completeness.

## Context

This repo is a small trade blotter that predates our design system. We are migrating it onto the system used by our product, Arch.

- **The design reference** — `design/reference.html` — is a self-contained prototype of Arch, built entirely on the system. Open it straight in a browser; there is no build step. It is the source of truth for how the system looks and behaves, so inspect it in DevTools, measure it and click around. It opens in the light theme, which is the one we are targeting. Its data and product logic are not part of the test.
- **The tokens** — `frontend/src/lib/ds/tokens.css` — are generated from the system and imported globally. Use the custom properties (`var(--space-8)`, `var(--fg-default)`, …) in new and migrated code. Don't hand-edit the file; if a token looks wrong or missing, say so in `DECISIONS.md`.
- **Legacy styling** lives in `frontend/src/lib/theme.ts` and is read via `${({ theme }) => …}`. It goes away as screens migrate.

A colleague has made a start. They landed the tokens, the font and the base styles, and migrated the trades list (`/trades`). Everything else is still legacy.

### Where to look in the reference

The blotter's screens don't map one-to-one onto Arch. These are their closest counterparts:

| In the blotter | In the reference |
|----------------|------------------|
| Trades list (`/trades`) | **Lattice** in the left rail: a pipeline's list of breaks. Click a group (e.g. Cleared) to expand its trades. |
| Trade detail (`/trades/[id]`) | The drawer that opens when you click a trade in Lattice. |
| Emails on a trade | **Trade support inbox**: click a row, then the **Email thread** tab in the drawer. |
| Assistant drawer | **Chat**. |
| Page headings and overall feel | **Home**. |

Sections that show "Not yet implemented" are outside this exercise.

## AI policy

We use AI tooling heavily ourselves. **We expect you will want to use it, and we are testing how you directed it.** Use `AI_USAGE.md` to tell us specifically how you steered your AI tools toward a result you are happy to submit.

## Part 1: Review the migration (~40 minutes)

Treat your colleague's work as a pull request you have been asked to review before it merges. Write your review in `AUDIT.md`.

### 1a. Component review (~25 minutes)

Your colleague migrated the page title, the status filter, the trades table and the status badges, along with the base styles (font, colours, focus and loading). Compare each of those with the design reference and note where they don't match: what the system specifies, what the build actually does, and how much it matters.

The app header and the overall page layout haven't been migrated yet, so differences there aren't discrepancies. Save them for 1b.

Be precise. Values beat adjectives: "the icon is 18px; the system's icons are 16px", not "the icon looks big". Look beyond the static screen too: states, interaction, keyboard, loading and performance. Where the system itself looks wrong or says nothing, note that as well.

You don't need to fix everything you find. Fix anything you would block the merge on if it is quick; otherwise note it and move on.

### 1b. Closing the gap (~15 minutes)

Even with every component fixed, the page as a whole won't feel like it belongs in Arch. In a few paragraphs: what would you change next, in what order, and why? What's missing from the system to get there, and what would you ask design before you started?

## Part 2: Migrate the trade detail page (~70 minutes)

Migrate `/trades/[id]` (the trade header, the emails panel, the notes panel and the `ui/` primitives they use) onto the system, so that it looks and behaves like it belongs in the reference.

- Match the reference wherever it has an answer.
- Where the page needs something the system doesn't cover, decide whether to compose it from what exists or propose an addition. Record the decision in `DECISIONS.md`.
- Keep behaviour as it is unless the migration needs a change. Note any behavioural bugs you spot rather than fixing them all.
- The app header and the assistant drawer are out of scope for this part.

## Part 3: Finesse (~30 minutes)

Pick one or two things that would make the blotter feel better to use: a transition, a loading state, a micro-interaction, a performance fix. Anything in the app is fair game here, including the header and drawer.

Restraint counts. One considered change beats five quick ones.

Record a short screen capture (2 minutes max) showing the before and after. In `DECISIONS.md`, explain what you changed, why, and how you checked it.

## Constraints

- Light theme only.
- Build on styled-components and the tokens. Don't add a component library or CSS framework.
- The API is out of scope.

## Deliverables

Fork the repo, commit and push your work, and share the link with us. Your submission **must** include:

1. The code (however far you got).
2. `AUDIT.md`: your Part 1 review.
3. `DECISIONS.md`: your migration decisions, gaps or problems you found in the system, other issues you noticed, and your Part 3 rationale with a link to the screen capture.
4. `AI_USAGE.md`: four short sections, **delegated / overrode / misled / next-time**. The override section is the one we read most closely.

## What we are evaluating

- **What you notice, and how precisely.** Type, colour, spacing, states, motion, performance.
- **Fidelity.** Does the migrated UI match the system, in its tokens as well as its looks?
- **Judgement.** What you do where the system and the product disagree, or where the system is silent.
- **Craft and restraint.** Motion and interaction that feel considered, not decorated.
- **UI performance.** Whether you find what makes the UI slow or janky, and how you checked.
- **Written artefacts.** Clear, specific entries tell us a lot about how you think.

We are **not** evaluating the backend, state management, test coverage, or how _much_ you got through.

## What happens next

- **Submission review**: we run your branch and read your AUDIT, DECISIONS and AI_USAGE files before the next call.
- **60-minute video call**: you walk us through what you did, then we pair on some UI together.
- **On-site final**: a design crit alongside one of our designers, plus Q&A for assessing team fit.
