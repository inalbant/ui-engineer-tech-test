"use client";

import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import { TradeDetailContent } from "@/components/TradeDetailContent";

const Page = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;
const Back = styled(Link)`
  display: inline-flex;
  margin-bottom: var(--space-stack);
  color: var(--fg-link);
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  text-decoration: none;
  &:hover { text-decoration: underline; }
  &:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  @media (forced-colors: active) { &:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; } }
`;
const Surface = styled.div`
  background: var(--bg-default);
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-control);
`;
export default function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const search = useSearchParams().toString();
  return (
    <Page>
      <Back href={`/trades${search ? `?${search}` : ""}`}>← Back to trades</Back>
      <Surface><TradeDetailContent tradeId={id} /></Surface>
    </Page>
  );
}
