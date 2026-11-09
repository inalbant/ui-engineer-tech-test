# Decisions

Use this document to log meaningful decisions. Short entries of a sentence or two are fine.

Explain what you chose, why, and what the downside is. Communicating design and technical trade-offs is a crucial part of our daily work.

Don't feel you have to include every minor decision.

---

## Part 2: Migration

Decisions you made while migrating the trade detail page: where you followed the reference, where you deviated, and why.

-

## Gaps and problems in the system

Where the page needed something the system doesn't cover, or a token or component looked wrong. For each: what the page needed, what the system offers, what you did, and what you would propose. If you already covered it in `AUDIT.md`, point to it rather than repeating it.

-

## Other things I noticed

Behavioural bugs or anything else outside the migration that you spotted but didn't fix, and how much each matters.

-

## Part 3: Finesse

What you changed, why it was worth the time, and how you checked it (tools, measurements, devices).

- I moved the assistant’s message bubble styled component outside the render function, passed the message role through a styling prop, and replaced array-index keys with message IDs. Previously, each update created new component types, repeatedly remounting existing bubbles and triggering a hook-order error in development.

  I checked the change using React DevTools Profiler exports before and after. The recordings show repeated bubble remounting before the change and stable component identities afterwards; the hook-order error also disappeared. Median assistant render duration was similar (2.6 ms before, 2.5 ms after), with mixed results across other timing metrics, so I am claiming improved component stability and correctness rather than a demonstrated rendering speed-up.

## Next

What you would do with more time.

-
