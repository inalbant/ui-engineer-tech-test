"use client";

import styled from "styled-components";
import Link from "next/link";
import { Badge, statusTone } from "./ui";
import { formatDate, formatNotional } from "@/lib/format";
import { useTradesWorkspace } from "./TradesWorkspace";
import type { Trade } from "@/lib/schemas";

const Frame = styled.div`
  flex: 1;
  min-height: 0;
  background: var(--bg-default);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-control);
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);

  th,
  td {
    padding: var(--space-4) var(--space-8);
    border-bottom: var(--border-width-hairline) solid var(--border-divider);
    text-align: left;
    vertical-align: middle;
  }

  th:first-child,
  td:first-child {
    padding-left: var(--space-12);
  }

  th {
    position: sticky;
    top: 0;
    z-index: 1;
    box-shadow: inset 0 calc(-1 * var(--border-width-hairline)) 0 var(--border-divider);
    height: var(--row-md);
    background: var(--bg-subtle);
    color: var(--fg-secondary);
    font-weight: var(--text-meta-weight);
    white-space: nowrap;
  }

  td {
    height: var(--row-tall);
    color: var(--fg-default);
  }

  tbody tr {
    cursor: pointer;
    transition: background-color 300ms ease-in;
  }

  tbody tr:hover {
    background: var(--state-hover);
  }

  tbody tr[data-selected="true"] {
    background: var(--state-selected);
    box-shadow: inset var(--border-width-hairline) 0 var(--border-highlight);
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const TradeLink = styled(Link)`
  color: #00a88b;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

interface TradesTableProps {
  trades: Trade[];
  search?: string;
}

export function TradesTable({ trades, search = "" }: TradesTableProps) {
  const workspace = useTradesWorkspace();
  return (
    <Frame>
      <Table>
        <thead>
          <tr>
            <th>Trade ID</th>
            <th>Counterparty</th>
            <th>Product</th>
            <th>Notional</th>
            <th>Trade date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((t) => (
            <tr
              key={t.id}
              data-selected={workspace?.selectedId === t.id}
              onClick={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest("a, button, input") || window.getSelection()?.toString()) return;
                event.currentTarget.querySelector<HTMLAnchorElement>("a")?.click();
              }}
            >
              <td>
                <TradeLink
                  href={`/trades/${t.id}${search ? `?${search}` : ""}`}
                  scroll={false}
                  aria-current={workspace?.selectedId === t.id ? "true" : undefined}
                  onClick={(event) => {
                    if (workspace && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                      event.preventDefault();
                      workspace.trigger.current = event.currentTarget;
                      workspace.openTrade(t.id);
                    }
                  }}
                >
                  {t.trade_id}
                </TradeLink>
              </td>
              <td>{t.counterparty_name}</td>
              <td>{t.product_type}</td>
              <td>{formatNotional(t.notional_amount, t.currency_code)}</td>
              <td>{formatDate(t.trade_date)}</td>
              <td>
                <Badge $tone={statusTone(t.status)}>{t.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Frame>
  );
}
