# Audit

Review of the trades list migration (`/trades`) against the light-theme design reference. Findings combine browser checks, DevTools measurements and source inspection, as noted below. The original app header and overall layout were outside the colleague’s migration and are discussed separately in 1b. Findings describe that review baseline, with dispositions updated for the completed fixes, Part 2 migration and later list refinements.

## 1a. Component review

### 1. Status filtering loses rapid selections — merge blocker, fixed

Before the fix, with no filters selected and network throttling enabled, clicking Dispute and then Submitted before the first navigation completed left only Submitted selected in the controls, URL and results. As this control supports multiple selections, both statuses should remain selected.

Source inspection showed that each click derived its next selection from the current render’s URL parameters. This was consistent with the second click using the earlier selection state while navigation was pending and overwriting the first change.

**Disposition:** Fixed. Each toggle now reads the latest browser URL and updates it synchronously with `history.replaceState`, which Next.js integrates with `useSearchParams`. Filtering already fetches data on the client, so this avoids an unnecessary page navigation without adding a second selection store. It retains the existing replace-history behaviour and preserves unrelated query parameters and the URL fragment.

**Validation:** Three regression tests cover rapid additions with a stale search-parameter snapshot, removing pending selections and clearing the final status, and bookmarked/subsequently changed URLs. Live browser checks confirmed successive clicks retain both selected statuses in the controls, URL and final results; selections also survive reloading. The original throttled-network reproduction has not yet been repeated manually after the fix.

### 2. Keyboard focus is obscured by adjacent filters — merge blocker, fixed

Before the fix, when multiple statuses were selected, the adjacent segment partially covered the focused segment’s outline. This made the keyboard focus indicator incomplete. The focused control should remain clearly distinguishable regardless of neighbouring selection states.

The original filter focus styling was also legacy: a 2px blue outline with a 2px offset, rather than the reference’s token-based `--focus-ring`.

**Disposition:** Fixed for status filters. The focused segment now paints above its neighbours and uses `--focus-ring`, retaining the selected segment’s elevation. A system-colour outline provides a forced-colours fallback. Part 2 also migrated the shared Button and detail controls to token-based focus styling. The global legacy focus rule and unmigrated consumers remain follow-ups.

**Validation:** Live browser checks with Tab and Shift+Tab showed a complete focus ring alongside adjacent selected segments, including in the wrapped control layout. Space and Enter toggled the focused status and updated the URL. The forced-colours fallback was checked in source, not visually tested.

### 3. Status counts become misleading after filtering — fixed after review

In the reviewed build, selecting a status caused unselected statuses to display zero; selecting another restored its count. Counts came from the filtered response, so zero did not mean there were no trades available in that status.

Lattice represents active criteria in a filter-summary row above the table. The blotter’s multi-select segmented control is therefore a product adaptation whose behaviour should be agreed, rather than treated as a direct copy of the reference.

**Disposition:** Fixed after a follow-up review of the zero counts: counts should represent totals across all trades. Counts now use the unfiltered query; table results still follow the selected statuses. Unknown totals display “—” rather than false zeros, with a tooltip explaining the total’s scope. Two regression tests cover stable counts across filtered results and unavailable totals. A live check retained counts of 17/8/10/2/3 when switching from Dispute to Dispute + Submitted, then Submitted only. The reference’s broader filter-pattern question remains open.

### 4. Table density and numeric alignment differ — follow-up

The build specifies 48px body rows, compared with the reference’s measured 40px rows. This reduces the number of trades visible at once.

Notional amounts are left-aligned without tabular numerals. The reference right-aligns currency amounts and uses tabular numerals, making values easier to compare vertically.

**Disposition:** Not fixed; follow up by using `--row-lg` for body rows and right-aligning the notional column with tabular numerals.

### 5. Status badges use a different variant — fixed during Part 2

The reference’s table statuses use outlined badges with a 6px radius. The reviewed build used tinted fills and a 999px pill radius. The appropriate correction is the outlined variant with `--radius-small`, retaining semantic colours for the blotter’s statuses.

**Disposition:** Fixed through the shared Badge primitive during Part 2: transparent background, semantic outline and `--radius-small` (6px). The trades list now uses this outlined variant. The detail header uses a separate filled/subtle variant, as shown in the supplied drawer screenshot. Both retain status labels and the existing colour mapping. The updated list and detail header were inspected live.

### 6. Page heading combines inconsistent typography tokens — follow-up

DevTools shows the Trades heading uses Figtree at 18px, weight 600, with a 32px line height and normal letter spacing. The implementation combines the heading-lg font size with title line-height tokens. The system’s heading-lg style pairs 18px with a 24px line height and tight tracking; its title style pairs 24px with 32px.

I would confirm the intended page-heading level and apply that complete typography style. I have not verified a corresponding Home heading, so I am not claiming a measured mismatch against that screen.

**Disposition:** Deferred pending confirmation of the intended heading variant.

### 7. Table colours do not consistently follow the system — minor follow-up

Trade links use hard-coded `#00a88b` instead of `--fg-link`, which resolves to `#00A78B` in the light theme. The visible difference is small, but bypassing the token makes future system updates harder to apply. Table headings also use `--fg-secondary`, whereas the reference table uses `--fg-tertiary`. Found through source inspection.

**Disposition:** Not fixed; deferred token and colour correction.

### 8. Filtering lacks visible pending feedback — follow-up

Under network throttling, changing status filters provides no visible loading feedback during the observed delay. The page has an initial-loading skeleton, but source inspection shows its rendering condition checks `isLoading` rather than separately representing subsequent fetching. I would distinguish the pending filter selection from the currently displayed results so users can understand what is happening.

**Disposition:** Not fixed; deferred subsequent-fetching feedback, separate from the lost-selection blocker in finding 1.

### 9. Motion and skeleton styling need follow-up — minor

Source inspection shows the table hover declares `300ms ease-in`, while the reference’s interaction tint uses `--duration-quick` (110ms) and `--easing-standard`. The initial-loading skeleton also uses hard-coded colours and a 1.2-second animation of `left`, rather than the motion tokens. Its animation does not consult reduced-motion preferences. Neither has been performance-profiled, so these are consistency and accessibility follow-ups, not a claim of measured jank.

**Disposition:** Deferred. Use the interaction tokens for table hover, add reduced-motion handling to the skeleton, and profile before choosing a performance optimisation. The new detail-panel transition is a separate interaction using the reference’s 240ms layout-transition timing; see `DECISIONS.md`.

## 1b. Closing the gap

I would migrate the shared app shell first, starting with the header, because it frames both the trades list and detail screens. The header’s typography, spacing and colours still need migration. Its Assistant button now inherits the migrated shared Button primitive; that does not complete the header migration. Arch’s sidebar toggle, search, notifications and account controls demonstrate its wider navigation pattern, but their absence is not itself a migration defect. Before adding them, I would clarify which navigation and global actions the blotter requires.

The Part 2 detail panel now uses the available workspace width alongside the table, replacing the centred 1200px list constraint. I would next confirm the workspace gutters, minimum usable table width and responsive behaviour with design. The chosen 460px detail width and 900px transition to a full-width panel are local adaptations, not established reference measurements. The Trades title and existing status control now share a compact toolbar, with the filters below the title on narrow screens. Column headings stay visible while rows scroll within the table.

Then I would integrate the assistant into that workspace. It currently opens from a single “Assistant” header button as a drawer with a backdrop over the content. Arch exposes chat through “Ask Arch Agent” in the header and “Chat” in the sidebar, and opens an adjacent panel that reduces the main workspace width. Adopting that layout would let users inspect trades and emails while consulting the assistant. I would confirm how the panel should behave when the viewport cannot comfortably accommodate both areas.

Arch also provides suggestions, history, attachments and “In this chat” context. Before introducing these, I would ask which capabilities belong in the blotter. These features need product and API support as well as matching UI, so I would keep them separate from the visual migration.

## The system itself

The reference provides useful patterns, but I have not established the following guidance for the blotter. These are questions for design rather than confirmed omissions from the system:

- **Status filtering:** Which pattern should support the blotter’s multi-select statuses? Counts now represent all trades following review; confirm that convention with design. Lattice uses a filter-summary row; see finding 3.
- **Pending results:** How should pending filter selections and fetching results be represented, including keyboard and assistive-technology feedback? See finding 8.
- **Page hierarchy:** Which heading variant should the standalone Trades screen use? See finding 6.
- **Responsive workspace:** What are the intended gutters and minimum table width, and when should the assistant switch from an adjacent panel to a narrower-screen presentation? See 1b.
