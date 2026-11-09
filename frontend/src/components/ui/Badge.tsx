"use client";

import styled, { css } from "styled-components";
import type { TradeStatus } from "@/lib/schemas";

type Tone = "neutral" | "warn" | "success" | "danger" | "muted";

const toneStyles = {
  neutral: css`
    --badge-fill: var(--bg-tint);
    --badge-line: var(--border-default);
    --badge-ink: var(--fg-secondary);
  `,
  warn: css`
    --badge-fill: var(--status-warning-tint);
    --badge-line: var(--status-warning-border-subtle);
    --badge-ink: var(--status-warning-on-subtle);
  `,
  success: css`
    --badge-fill: var(--status-success-tint);
    --badge-line: var(--status-success-border-subtle);
    --badge-ink: var(--status-success-on-subtle);
  `,
  danger: css`
    --badge-fill: var(--status-danger-tint);
    --badge-line: var(--status-danger-border-subtle);
    --badge-ink: var(--status-danger-on-subtle);
  `,
  muted: css`
    --badge-fill: var(--bg-tint);
    --badge-line: var(--border-default);
    --badge-ink: var(--fg-tertiary);
  `,
};

export const Badge = styled.span<{ $tone?: Tone; $variant?: "outlined" | "subtle" }>`
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  height: var(--control-xs-height);
  padding: 0 var(--space-4);
  border: var(--border-width-hairline) solid ${({ $variant }) => $variant === "subtle" ? "transparent" : "var(--badge-line)"};
  border-radius: var(--radius-small);
  background: ${({ $variant }) => $variant === "subtle" ? "var(--badge-fill)" : "transparent"};
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
