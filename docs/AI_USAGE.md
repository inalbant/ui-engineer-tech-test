# AI usage

## Delegated

- I used Codex to inspect the source, organise the audit and implement the rapid-filter, keyboard-focus and assistant bubble fixes. I reproduced the original filter and focus problems myself; Codex added regression tests and checked the resulting UI in the browser.
- I provided React DevTools recordings for Codex to analyse. It compared component identity operations and render timings, keeping the conclusions limited to what those recordings supported.
- I asked Codex to migrate the trade detail page using the brief and handoff. It migrated the header, email and notes styling and shared primitives, then ran type checking, tests and a production build. Its browser checks included desktop/mobile layouts, keyboard focus, a confirmed trade and an unavailable trade; these are automated checks, not a claim that I personally tested every state.

## Overrode

- I challenged the assumption that the blotter would be embedded in Arch and inherit its header. We re-read the brief and kept design-system adoption separate from product integration; missing Arch navigation features became questions for design rather than automatic requirements.
- I checked the reference myself and supplied measurements: 40px reference rows versus 48px in the build, outlined 6px badges versus tinted pills, and right-aligned currency values with tabular numerals. I also supplied the Trades heading’s computed 18px/32px styles. These observations kept the audit grounded in values instead of an unsupported visual-match claim.
- I corrected the filtering comparison after showing that Lattice uses a filter-summary row, rather than the blotter’s multi-select segmented control. The audit now treats that control as a product adaptation needing agreed semantics.

- I supplied screenshots comparing Lattice, its right-hand detail panel and Codex’s full-width detail page. Those screenshots showed the composition mismatch and the different table/detail badge variants. I asked for a panel beside the table while preserving direct trade links; Codex revised the layout and split the badge variants.

## Misled

- AI’s initial header-inheritance and filtering assumptions sent the review toward comparisons the reference and brief did not support. Re-reading the brief and inspecting the actual interaction corrected this. We did not keep a reliable record of the time this cost.
- Bubble remounting suggested a possible performance benefit, but the profiler results were mixed: median render duration was 2.6ms before and 2.5ms after, while other metrics did not consistently improve. We retained the correctness/component-stability claim and rejected a proven speed-up claim. A screenshot of initial table rendering was also excluded from the assistant comparison because it showed the wrong interaction.

## Next time

- Establish the reference-to-screen mapping and product boundaries before asking AI to propose migration work. Give it measured values and the exact interaction to reproduce, and distinguish source inspection from browser verification in the write-up.
- Record comparable before/after interactions and active task time as I go. Review AI’s visual claims against the rendered reference, and keep the implementation focused on the brief instead of copying unrelated Arch features.
