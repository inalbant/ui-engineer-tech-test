# AI usage

## Delegated

- I used Codex to inspect the source, structure the audit and implement the rapid-filter, focus and assistant bubble fixes. I reproduced the lost selections and focus clipping myself; Codex implemented the fixes, added regression tests and checked the resulting interactions in the browser.
- I supplied React DevTools recordings for Codex to analyse. It compared bubble mount/unmount operations and render durations; the evidence supported stable component identity and removal of the hook-order error, without a consistent timing improvement.
- I delegated the detail migration and shared primitives, then steered revisions using reference screenshots and the running app. Codex ran type checking, 21 active tests and a production build, plus browser checks for responsive layout, keyboard navigation, history, draft preservation and the later list refinements. The specific checks and remaining verification limits are recorded in `DECISIONS.md`.

## Overrode

- **Scope:** Codex initially assumed the blotter would be embedded in Arch and inherit its header. I challenged that interpretation. We re-read the brief and separated design-system adoption from product integration; Arch’s additional navigation and global features became questions for design rather than implementation requirements.
- **Reference fidelity:** I supplied measured differences rather than accepting broad visual comparisons: 40px reference rows versus 48px in the build, outlined 6px badges versus tinted pills, and right-aligned amounts with tabular numerals. I also provided the Trades heading’s computed 18px/32px styles. When the filtering comparison was wrong, I showed that Lattice uses a filter-summary row; the audit now treats the blotter’s segmented control as a product adaptation. In the later review, we agreed that its counts should represent totals across all trades.
- **Composition:** The first detail migration adopted tokens but retained a wide standalone page. I supplied screenshots of Lattice, its detail panel and our implementation to make the mismatch explicit, then asked for the panel beside the table with direct trade links preserved. The revised implementation also distinguishes outlined table badges from filled detail badges. I subsequently approved the proposed Emails/Notes tabs so notes would not remain buried below every email.
- **Interaction:** I pointed out that the reference animates panel opening and closing while our first panel implementation did not. I asked for that refinement; Codex used the reference’s 240ms layout-transition tokens, retained outgoing content for the exit and added reduced-motion handling. Browser checks confirmed the computed timing; we did not measure frame performance.

- **Review cadence and usability:** I questioned the missing sticky column headings, the zero counts on unselected statuses and the separation of filters from the title. After discussing the options, I asked Codex to implement sticky headings, stable global counts and a compact toolbar one at a time, pausing after each for my demo; I approved the first two before asking it to proceed to the next change.

## Misled

- Reading reference styles was insufficient to judge the whole composition. The initial detail pass still needed layout and badge revisions after I supplied screenshots. The earlier header and filtering assumptions also required correcting the audit. I did not record active time reliably, so I cannot give a defensible estimate of that rework.
- The assistant’s repeated remounting could easily have become an unsupported speed-up claim. The profiler recordings showed mixed timing results: median render duration was 2.6ms before and 2.5ms after. We limited the conclusion to correctness and component stability. A screenshot showing initial table rendering was excluded because it did not capture the assistant interaction being compared.

## Next time

- Give AI the reference-to-screen mapping, screenshots and interaction acceptance criteria before the first implementation: selected states, keyboard behaviour, history, loading and closing. Review the composition early, before investing in smaller styling details, and retain the one-change-at-a-time demo loop for subsequent refinements.
- Keep source findings, my own observations and agent-run checks distinct. Capture comparable profiling runs and active task time as I work. Passing tests and a build support correctness, but visual fidelity still needs direct comparison; unresolved behaviour and product questions should remain explicit follow-ups rather than silently expanding the migration.
