"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import styled from "styled-components";
import { useGetTradeQuery } from "@/lib/api/tradesApi";
import { TradeMetadata } from "./TradeMetadata";
import { EmailsPanel } from "./EmailsPanel";
import { NotesPanel } from "./NotesPanel";
import { Button, EmptyState } from "./ui";

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  > header { flex-shrink: 0; }
`;
const TabList = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: var(--space-16);
  padding: var(--space-8) var(--space-12) 0;
  border-bottom: var(--border-width-hairline) solid var(--border-divider);
`;
const Tab = styled.button`
  height: var(--control-md-height);
  padding: var(--space-6) 0;
  border: 0;
  border-bottom: var(--border-width-rule) solid transparent;
  background: transparent;
  color: var(--fg-secondary);
  font-size: var(--text-heading);
  line-height: var(--text-heading-line-height);
  font-weight: var(--text-heading-weight);
  cursor: pointer;
  &[aria-selected="true"] { color: var(--fg-default); border-bottom-color: var(--brand-fill); }
  &:hover { color: var(--fg-default); }
  &:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: var(--radius-mark); }
  @media (forced-colors: active) { &:focus-visible { outline: 2px solid Highlight; } }
`;
const TabPanel = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  &[hidden] { display: none; }
  &:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--fg-default); }
`;
const Feedback = styled.div`
  padding: var(--space-stack-loose);
  color: var(--fg-secondary);
  text-align: center;
`;

export function TradeDetailContent({ tradeId, hasCloseControl = false }: {
  tradeId: string;
  hasCloseControl?: boolean;
}) {
  const query = useGetTradeQuery(tradeId);
  const [selection, setSelection] = useState({ tradeId, tab: 0 });
  const activeTab = selection.tradeId === tradeId ? selection.tab : 0;
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const selectTab = (tab: number) => setSelection({ tradeId, tab });
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % 2; break;
      case "ArrowLeft": next = (index - 1 + 2) % 2; break;
      case "Home": next = 0; break;
      case "End": next = 1; break;
      default: return;
    }
    event.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  if (query.isLoading) return <Feedback role="status">Loading trade…</Feedback>;
  if (query.isError || !query.data) {
    return (
      <Feedback>
        <div role="alert">
          <EmptyState title="Trade unavailable" description="We couldn’t load this trade. Try again or return to the trades list." />
        </div>
        <Button $variant="secondary" onClick={() => query.refetch()}>Try again</Button>
      </Feedback>
    );
  }
  const trade = query.data;
  const tabs = [`Emails (${trade.emails.length})`, `Notes (${trade.notes.length})`];
  return (
    <Detail>
      <TradeMetadata trade={trade} reserveCloseSpace={hasCloseControl} />
      <TabList role="tablist" aria-label="Trade information">
        {tabs.map((label, index) => (
          <Tab
            key={index}
            ref={(element) => { tabRefs.current[index] = element; }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={activeTab === index}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => selectTab(index)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          >{label}</Tab>
        ))}
      </TabList>
      <TabPanel role="tabpanel" id={`${id}-panel-0`} aria-labelledby={`${id}-tab-0`} hidden={activeTab !== 0} tabIndex={0}>
        <EmailsPanel emails={trade.emails} headingHidden />
      </TabPanel>
      <TabPanel role="tabpanel" id={`${id}-panel-1`} aria-labelledby={`${id}-tab-1`} hidden={activeTab !== 1} tabIndex={0}>
        <NotesPanel key={trade.id} tradeId={trade.id} status={trade.status} notes={trade.notes} headingHidden />
      </TabPanel>
    </Detail>
  );
}
