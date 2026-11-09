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
  position: relative;
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

  &:focus-visible {
    z-index: 1;
    outline: none;
    box-shadow: var(--focus-ring),
      ${({ $active }) => ($active ? "var(--elevation-low)" : "0 0 0 0 transparent")};
  }

  @media (forced-colors: active) {
    &:focus-visible {
      outline: var(--border-width-rule) solid CanvasText;
      outline-offset: var(--space-2);
    }
  }
`;

interface StatusFilterProps {
  selected: TradeStatus[];
  counts: Record<TradeStatus, number>;
  onToggle: (status: TradeStatus) => void;
}

export function StatusFilter({
  selected,
  counts,
  onToggle,
}: StatusFilterProps) {
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
            onClick={() => onToggle(s)}
          >
            <span>{s}</span>
            <span className="count">{counts[s] ?? 0}</span>
          </Segment>
        );
      })}
    </Track>
  );
}
