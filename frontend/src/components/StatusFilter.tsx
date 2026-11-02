"use client";

import styled from "styled-components";
import type { TradeStatus } from "@/lib/schemas";

const ALL_STATUSES: TradeStatus[] = [
  "dispute",
  "submitted",
  "confirmed",
  "deleted",
  "error",
];

const Track = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  min-height: var(--control-md-height);
  background: var(--bg-tint);
  border-radius: var(--radius-control);
`;

const Segment = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--control-sm-height);
  padding: 0 var(--space-12);
  border: var(--border-width-hairline) solid transparent;
  border-radius: calc(var(--radius-control) - var(--space-2));
  background: ${({ $active }) => ($active ? "var(--bg-default)" : "transparent")};
  box-shadow: ${({ $active }) => ($active ? "var(--elevation-low)" : "none")};
  color: ${({ $active }) =>
    $active ? "var(--fg-default)" : "var(--fg-secondary)"};
  font-size: var(--text-control);
  line-height: var(--text-control-line-height);
  text-transform: capitalize;
  cursor: pointer;
  transition:
    color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard);

  .count {
    color: var(--fg-tertiary);
  }
`;

interface StatusFilterProps {
  selected: TradeStatus[];
  counts: Record<TradeStatus, number>;
  onChange: (next: TradeStatus[]) => void;
}

export function StatusFilter({
  selected,
  counts,
  onChange,
}: StatusFilterProps) {
  const toggle = (s: TradeStatus) => {
    if (selected.includes(s)) {
      onChange(selected.filter((x) => x !== s));
    } else {
      onChange([...selected, s]);
    }
  };

  return (
    <Track role="group" aria-label="Filter by status">
      {ALL_STATUSES.map((s) => {
        const active = selected.includes(s);
        return (
          <Segment
            key={s}
            type="button"
            $active={active}
            aria-pressed={active}
            onClick={() => toggle(s)}
          >
            <span>{s}</span>
            <span className="count">{counts[s] ?? 0}</span>
          </Segment>
        );
      })}
    </Track>
  );
}
