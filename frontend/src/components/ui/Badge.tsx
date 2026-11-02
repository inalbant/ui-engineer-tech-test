"use client";

import styled, { css } from "styled-components";
import type { TradeStatus } from "@/lib/schemas";

type Tone = "neutral" | "warn" | "success" | "danger" | "muted";

const toneStyles = {
  neutral: css`
    --badge-fill: var(--bg-tint);
    --badge-ink: var(--fg-secondary);
  `,
  warn: css`
    --badge-fill: var(--status-warning-tint);
    --badge-ink: var(--status-warning-on-subtle);
  `,
  success: css`
    --badge-fill: var(--status-success-tint);
    --badge-ink: var(--status-success-on-subtle);
  `,
  danger: css`
    --badge-fill: var(--status-danger-tint);
    --badge-ink: var(--status-danger-on-subtle);
  `,
  muted: css`
    --badge-fill: var(--bg-tint);
    --badge-ink: var(--fg-tertiary);
  `,
};

export const Badge = styled.span<{ $tone?: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--control-xs-height);
  padding: 0 var(--space-4);
  border: var(--border-width-hairline) solid transparent;
  border-radius: var(--radius-pill);
  background: var(--badge-fill);
  color: var(--badge-ink);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  font-weight: var(--text-meta-weight);
  white-space: nowrap;
  text-transform: capitalize;
  font-variant-numeric: tabular-nums;

  ${({ $tone = "neutral" }) => toneStyles[$tone]}
`;

export function statusTone(status: TradeStatus): Tone {
  switch (status) {
    case "dispute":
      return "warn";
    case "submitted":
      return "neutral";
    case "confirmed":
      return "success";
    case "deleted":
      return "muted";
    case "error":
      return "danger";
  }
}
