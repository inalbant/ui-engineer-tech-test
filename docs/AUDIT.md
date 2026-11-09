# Audit

Review of the trades list migration (`/trades`) against the light-theme design reference. Findings combine browser checks, DevTools measurements and source inspection, as noted below. The unmigrated app header and overall layout are discussed separately in 1b.

## 1a. Component review

### 1. Status filtering loses rapid selections — merge blocker, fixed

With no filters selected and network throttling enabled, clicking Dispute and then Submitted before the first navigation completes leaves only Submitted selected in the controls, URL and results. As this control supports multiple selections, both statuses should remain selected.

Source inspection showed that each click derived its next selection from the current render’s URL parameters. This was consistent with the second click using the earlier selection state while navigation was pending and overwriting the first change.

**Disposition:** Fixed. Each toggle now reads the latest browser URL and updates it synchronously with `history.replaceState`, which Next.js integrates with `useSearchParams`. Filtering already fetches data on the client, so this avoids an unnecessary page navigation without adding a second selection store. It retains the existing replace-history behaviour and preserves unrelated query parameters and the URL fragment.

**Validation:** Three regression tests cover rapid additions with a stale search-parameter snapshot, removing pending selections and clearing the final status, and bookmarked/subsequently changed URLs. Live browser checks confirmed successive clicks retain both selected statuses in the controls, URL and final results; selections also survive reloading. The original throttled-network reproduction has not yet been repeated manually after the fix.

### 2. Keyboard focus is obscured by adjacent filters — merge blocker, fixed

When multiple statuses are selected, the adjacent segment partially covers the focused segment’s outline. This makes the keyboard focus indicator incomplete. The focused control should remain clearly distinguishable regardless of neighbouring selection states.

The original filter focus styling was also legacy: a 2px blue outline with a 2px offset, rather than the reference’s token-based `--focus-ring`.

**Disposition:** Fixed for status filters. The focused segment now paints above its neighbours and uses `--focus-ring`, retaining the selected segment’s elevation. A system-colour outline provides a forced-colours fallback. The global legacy focus styling elsewhere remains a follow-up.

**Validation:** Live browser checks with Tab and Shift+Tab showed a complete focus ring alongside adjacent selected segments, including in the wrapped control layout. Space and Enter toggled the focused status and updated the URL. The forced-colours fallback was checked in source, not visually tested.

### 3. Status counts become misleading after filtering — follow-up

Selecting a status causes unselected statuses to display zero; selecting another restores its count. The counts are calculated from the filtered response, so zero does not mean there are no trades available in that status. I would clarify the intended count semantics and either retain counts across all trades or change how counts are presented.

Lattice represents active criteria in a filter-summary row above the table. The blotter’s multi-select segmented control is therefore a product adaptation whose behaviour should be agreed, rather than treated as a direct copy of the reference.

**Disposition:** Deferred pending clarification of count semantics and the intended filter pattern.

### 4. Table density and numeric alignment differ — follow-up

The build specifies 48px body rows, compared with the reference’s measured 40px rows. This reduces the number of trades visible at once.

Notional amounts are left-aligned without tabular numerals. The reference right-aligns currency amounts and uses tabular numerals, making values easier to compare vertically.

**Disposition:** Not fixed; follow up by using `--row-lg` for body rows and right-aligning the notional column with tabular numerals.

### 5. Status badges use a different variant — fixed during Part 2

The reference’s table statuses use outlined badges with a 6px radius. The build uses tinted fills and a 999px pill radius. I would use the outlined variant and the system’s `--radius-small`, retaining appropriate semantic colours for the blotter’s statuses.

**Disposition:** Fixed through the shared Badge primitive during Part 2: transparent background, semantic outline and `--radius-small` (6px). The trades list and detail header now share this variant. The list was inspected live after the change; status labels and existing colour mapping are retained. Detail headers use a separate filled/subtle variant, as shown in the supplied drawer screenshot.

### 6. Page heading combines inconsistent typography tokens — follow-up

DevTools shows the Trades heading uses Figtree at 18px, weight 600, with a 32px line height and normal letter spacing. The implementation combines the heading-lg font size with title line-height tokens. The system’s heading-lg style pairs 18px with a 24px line height and tight tracking; its title style pairs 24px with 32px.

I would confirm the intended page-heading level and apply that complete typography style. I have not verified a corresponding Home heading, so I am not claiming a measured mismatch against that screen.

**Disposition:** Deferred pending confirmation of the intended heading variant.

### 7. Table colours do not consistently follow the system — minor follow-up

Trade links use hard-coded `#00a88b` instead of `--fg-link`, which resolves to `#00A78B` in the light theme. The visible difference is small, but bypassing the token makes future system updates harder to apply. Table headings also use `--fg-secondary`, whereas the reference table uses `--fg-tertiary`. Found through source inspection.

**Disposition:** Not fixed; deferred token and colour correction.

### 8. Filtering lacks visible pending feedback — follow-up

Under network throttling, changing status filters provides no visible loading feedback during the observed delay. The page has an initial-loading skeleton, but source inspection shows its rendering condition checks `isLoading` rather than separately representing subsequent fetching or pending navigation. I would distinguish the pending filter selection from the currently displayed results so users can understand what is happening.

**Disposition:** Not fixed; deferred pending-state improvement, separate from the lost-selection blocker in finding 1.

## 1b. Closing the gap

I would migrate the shared app shell first, starting with the header, because it frames both the trades list and detail screens. The existing header should adopt Arch’s typography, spacing, colours and control styles. Arch’s sidebar toggle, search, notifications and account controls demonstrate its wider navigation pattern, but their absence is not itself a migration defect. Before adding them, I would clarify which navigation and global actions the blotter requires.

The Part 2 detail panel now uses the available workspace width alongside the table, replacing the centred 1200px list constraint. I would next confirm the workspace gutters, minimum usable table width and responsive behaviour with design. The chosen 460px detail width and 900px transition to a full-width panel are local adaptations, not established reference measurements.

Then I would integrate the assistant into that workspace. It currently opens from a single “Assistant” header button as a drawer with a backdrop over the content. Arch exposes chat through “Ask Arch Agent” in the header and “Chat” in the sidebar, and opens an adjacent panel that reduces the main workspace width. Adopting that layout would let users inspect trades and emails while consulting the assistant. I would confirm how the panel should behave when the viewport cannot comfortably accommodate both areas.

Arch also provides suggestions, history, attachments and “In this chat” context. Before introducing these, I would ask which capabilities belong in the blotter. These features need product and API support as well as matching UI, so I would keep them separate from the visual migration.

## The system itself

The reference provides useful patterns, but I have not established the following guidance for the blotter. These are questions for design rather than confirmed omissions from the system:

- **Status filtering:** Which pattern should support the blotter’s multi-select statuses, and should counts represent all trades or the filtered results? Lattice uses a filter-summary row; see finding 3.
- **Pending results:** How should pending filter selections and fetching results be represented, including keyboard and assistive-technology feedback? See finding 8.
- **Page hierarchy:** Which heading variant should the standalone Trades screen use? See finding 6.
- **Responsive workspace:** What are the intended gutters and minimum table width, and when should the assistant switch from an adjacent panel to a narrower-screen presentation? See 1b.
