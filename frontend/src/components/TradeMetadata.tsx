"use client";

import styled from "styled-components";
import { Badge, statusTone } from "./ui";
import { formatDate, formatNotional } from "@/lib/format";
import type { TradeDetail } from "@/lib/schemas";

const Wrap = styled.header`
  padding: var(--space-row-y);
  border-bottom: var(--border-width-hairline) solid var(--border-divider);
`;
const Top = styled.div<{ $reserveCloseSpace: boolean }>`
  padding-right: ${({ $reserveCloseSpace }) => $reserveCloseSpace ? "var(--space-32)" : "0"};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-stack-tight);
`;
const Id = styled.p`
  margin: 0;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  color: var(--fg-tertiary);
  font-variant-numeric: tabular-nums;
`;
const Title = styled.h1`
  margin: var(--space-4) 0 0;
  font-size: var(--text-heading-lg);
  line-height: var(--text-heading-lg-line-height);
  font-weight: var(--text-heading-lg-weight);
  letter-spacing: var(--text-heading-lg-tracking);
  overflow-wrap: anywhere;
`;
const Fields = styled.dl`
  margin: var(--space-stack) 0 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-stack-tight) var(--space-stack-loose);
`;
const Field = styled.div`
  min-width: 0;
  dt {
    font-size: var(--text-label);
    line-height: var(--text-label-line-height);
    font-weight: var(--text-label-weight);
    color: var(--fg-tertiary);
  }
  dd {
    margin: var(--space-4) 0 0;
    font-size: var(--text-meta);
    line-height: var(--text-meta-line-height);
    color: var(--fg-default);
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
`;
export function TradeMetadata({ trade, reserveCloseSpace = false }: {
  trade: TradeDetail;
  reserveCloseSpace?: boolean;
}) {
  return (
    <Wrap>
      <Top $reserveCloseSpace={reserveCloseSpace}>
        <div><Id>{trade.trade_id}</Id><Title>{trade.counterparty_name}</Title></div>
        <Badge $variant="subtle" $tone={statusTone(trade.status)}>{trade.status}</Badge>
      </Top>
      <Fields>
        <Field><dt>Product</dt><dd>{trade.product_type}</dd></Field>
        <Field><dt>Notional ({trade.currency_code})</dt><dd>{formatNotional(trade.notional_amount, trade.currency_code)}</dd></Field>
        <Field><dt>Trade date</dt><dd>{formatDate(trade.trade_date)}</dd></Field>
        <Field><dt>Maturity</dt><dd>{formatDate(trade.maturity_date)}</dd></Field>
      </Fields>
    </Wrap>
  );
}
