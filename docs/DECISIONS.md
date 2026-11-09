# Decisions

## Part 2: Migration

- Trade clicks open a 460px right-hand panel beside the list, following the composition in the supplied Lattice screenshots. The list and detail body scroll independently. The trades workspace uses the available width; the app header and assistant layouts are unchanged. At 900px and below, the detail panel takes the workspace width and the list is temporarily hidden. Panel width and breakpoint are local responsive choices, not measured reference values.
- The selected trade is stored in the list URL as `?trade=<id>`, alongside existing status filters. Opening pushes one history entry; switching trades replaces that entry. Back/Forward restore panel state. Close/Escape returns to the opening list entry; a bookmarked panel without an opening entry closes by removing its trade parameter. Native history updates use Next’s existing search-parameter integration. Actual links retain `/trades/[id]` for new tabs and direct access, where the same detail content appears in a narrower, stacked standalone view. Its back link retains query parameters.
- The panel is a non-modal complementary region. Opening focuses its close button; closing restores focus to the last clicked trade link when available. No backdrop or focus trap prevents using the desktop table alongside it. Selecting a different trade resets the note draft so it cannot be accidentally submitted against another trade.
- The header follows the drawer’s heading-lg typography (18px/24px, weight 600, tight tracking), muted trade ID and compact two-column facts. Notional uses the shared currency formatter with an explicit currency-code label. The blotter lacks Arch’s action-summary data, so the counterparty remains its main heading; no synthetic suggestions, evidence or activity were added.
- Email messages use the reference’s compact sender/date typography, 8px frame radius, 12px inset and divided 13px/20px body. Kept the supplied message order, full bodies and existing recipient display; did not introduce message collapsing, replying or reference-only actions. Removed the 320px subject minimum and allowed long content and dates to wrap.
- Emails and Notes have separate counted tabs so notes are accessible without scrolling through every email. The header and tab bar stay above the scrolling active panel. The redundant “Trade details” toolbar is removed; close sits beside the trade identity and remains available during loading/errors. Tabs support arrow keys, Home/End, a single tab stop, selected state and associated tab panels. Both content panels remain mounted to preserve a note draft when switching tabs; changing trade resets the draft and returns to Emails. The direct detail page shares this tabbed content. Three regression tests cover visible content/counts, keyboard navigation and draft preservation/reset; desktop and 375px browser checks confirmed Notes access and draft preservation. No test note was saved.
- Composed notes from the existing section, body, metadata, field and button patterns. Retained dispute-only entry, the 500-character limit, submission logic and error text. Added no new note workflow.
- Migrated Panel, EmptyState and Button to tokens. Panel sections now have programmatically associated headings. Button keeps its existing variants and sizes, with reference heights (24px small / 28px medium), hover/pressed overlays, disabled opacity and keyboard focus. Because it is shared, header and assistant buttons inherit these primitive styles; their layouts and behaviour were not redesigned.
- Badge has explicit outlined and subtle variants, both with a 6px radius. The trades table uses outlined badges; the detail header uses the filled subtle variant shown in the supplied drawer screenshot. Existing status-to-colour mapping and status text are retained; the reference’s reconciliation statuses are different product states. See audit finding 5.
- Replaced plain loading text with a token-styled status message, keeping the back link available. A failed or missing trade now shows an alert and retry action rather than a blank page. This is a small state-completeness addition to the migration, using the existing query’s refetch action.

### Validation

Type checking, all 19 active tests and a production build passed for the final implementation; the existing WebSocket test remains skipped. Initial live checks covered a dispute trade with emails/notes, a confirmed trade without a note form, and an unavailable trade. The heading computed to 18px/24px at weight 600 and keyboard focus used the 2px foreground ring.

Panel checks covered opening from a status-filtered list, changing the selected trade, Escape/close with focus restoration, browser Forward, and reloading a panel URL. At 1440px the table remains beside the detail; at 375px the panel occupies the available width with no horizontal document overflow. Direct `/trades/[id]` links also render the shared stacked content. Three regression tests cover preserved URL parameters/fragments, one history entry across trade switches, closing bookmarked panels, and avoiding Next’s internal markers in native history updates.

The reference’s source CSS and the user-supplied screenshots informed the migration. The screenshots corrected the initial wide-page composition and the mistaken use of outlined badges in the detail header. The interactive local reference remained inaccessible to browser automation, so this does not claim a complete interaction or pixel-perfect comparison. Note submission and forced-colours mode have not been manually exercised in this migration.

## Gaps and problems in the system

- The reference supplies drawer, facts, message, section and field patterns, but no direct counterpart for this combination of trade facts, emails and editable internal notes. Composed those patterns with Emails and Notes tabs without adding a component dependency. The tabs adapt the reference’s tab-bar pattern to the blotter’s existing data. Confirm panel width and responsive breakpoint.
- Retained the existing semantic status mapping; Arch’s reconciliation statuses do not map one-to-one to the blotter. Confirm the mapping before treating it as a shared product contract.
- Count semantics, page heading hierarchy and pending filter results remain design questions in `AUDIT.md`. Generated tokens were not edited.

## Other things I noticed

- Note submission invalidates `Trades`, while the detail query provides `Trade`. A successful save may leave the detail note list stale until a refetch. This is a source-confirmed cache-tag mismatch, not a manually reproduced result; it deserves a focused follow-up.
- Note saving has no meaningful pending state and does not disable repeated submissions. Preserved for this styling migration; follow up with a pending label and duplicate-submission guard.
- The assistant still ignores the stream’s `done` marker and permits overlapping messages. The existing skipped WebSocket test and modal Dialog focus behaviour remain outside this migration. Dialog is not used on the detail page.

## Part 3: Finesse

- I moved the assistant’s message bubble styled component outside the render function, passed the message role through a styling prop, and replaced array-index keys with message IDs. Previously, each update created new component types, repeatedly remounting existing bubbles and triggering a hook-order error in development.

  I checked the change using React DevTools Profiler exports before and after. The recordings show repeated bubble remounting before the change and stable component identities afterwards; the hook-order error also disappeared. Median assistant render duration was similar (2.6 ms before, 2.5 ms after), with mixed results across other timing metrics, so I am claiming improved component stability and correctness rather than a demonstrated rendering speed-up.

- Added panel opening/closing motion after comparing the supplied reference. Desktop animates the workspace columns; the narrow-screen panel slides over the list. Both use the reference’s `--duration-slow` (240ms) and `--easing-standard`. Retain the outgoing content until transition end, with a computed-duration fallback for interrupted or zero-duration transitions. It is inert and hidden from assistive technology during exit; focus returns to the selected trade link. Reduced-motion CSS removes both transitions. A regression test covers retained/inert exit content and removal without a transition event. Browser computed styles confirmed 0.24s and `cubic-bezier(0.2, 0, 0.38, 0.9)`; opening/closing were exercised, but frame performance and OS reduced-motion mode were not measured.

## Next

Resolve the note refresh and pending-save issues first. Then address the deferred table density, numeric alignment, filtering feedback and count semantics in the audit. Follow the Part 1b shell priorities after clarifying workspace/navigation requirements with design. Confirm visual fidelity against the interactive reference and add targeted coverage for detail loading/error/retry if these states grow more complex.
