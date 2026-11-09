"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import styled, { keyframes } from "styled-components";
import { useListTradesQuery } from "@/lib/api/tradesApi";
import { TradeStatusSchema, type TradeStatus } from "@/lib/schemas";
import { StatusFilter } from "@/components/StatusFilter";
import { TradesWorkspace } from "@/components/TradesWorkspace";
import { TradeDetailPanel } from "@/components/TradeDetailPanel";
import { TradesTable } from "@/components/TradesTable";
import { EmptyState } from "@/components/ui";

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-16);
  margin-bottom: var(--space-16);

  h1 {
    margin: 0;
    font-size: var(--text-heading-lg);
    line-height: var(--text-title-line-height);
    font-weight: var(--text-title-weight);
  }
`;

const FilterRow = styled.div`
  margin-bottom: var(--space-16);
`;

const shimmer = keyframes`
  from { left: -40%; }
  to { left: 100%; }
`;

const SkeletonRow = styled.div`
  position: relative;
  overflow: hidden;
  height: var(--row-lg);
  margin-bottom: var(--space-4);
  border-radius: var(--radius-small);
  background: #eef0ef;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: -40%;
    width: 40%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.7),
      transparent
    );
    animation: ${shimmer} 1.2s linear infinite;
  }
`;

function TableSkeleton() {
  return (
    <div>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

function parseStatuses(raw: string[]): TradeStatus[] {
  return raw.flatMap((s) => {
    const parsed = TradeStatusSchema.safeParse(s);
    return parsed.success ? [parsed.data] : [];
  });
}

export default function TradesPage() {
  return (
    <Suspense
      fallback={<TableSkeleton />}
    >
      <TradesPageInner />
    </Suspense>
  );
}

function TradesPageInner() {
  const params = useSearchParams();
  const statuses = parseStatuses(params.getAll("status"));
  const selectedId = params.get("trade") || undefined;
  const listParams = new URLSearchParams(params.toString());
  listParams.delete("trade");

  const query = useListTradesQuery(
    statuses.length > 0 ? statuses : undefined,
  );
  const trades = query.data ?? [];

  const counts = useMemo(() => {
    const acc: Record<TradeStatus, number> = {
      dispute: 0,
      submitted: 0,
      confirmed: 0,
      deleted: 0,
      error: 0,
    };
    for (const t of trades) acc[t.status] += 1;
    return acc;
  }, [trades]);

  const toggleStatus = (status: TradeStatus) => {
    // Read the current URL so rapid clicks cannot use an older render's selection.
    const sp = new URLSearchParams(window.location.search);
    const current = parseStatuses(sp.getAll("status"));
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    sp.delete("status");
    next.forEach((s) => sp.append("status", s));
    const qs = sp.toString();
    // Next.js syncs useSearchParams with native history updates without a navigation.
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
    );
  };

  return (
    <TradesWorkspace selectedId={selectedId} detail={selectedId ? <TradeDetailPanel tradeId={selectedId} /> : null}>
      <Header>
        <div>
          <h1>Trades</h1>
        </div>
      </Header>

      <FilterRow>
        <StatusFilter
          selected={statuses}
          counts={counts}
          onToggle={toggleStatus}
        />
      </FilterRow>

      {query.isLoading ? (
        <TableSkeleton />
      ) : query.isError ? (
        <EmptyState
          title="Failed to load trades"
          description="Check the API is running on http://localhost:8000."
        />
      ) : (
        <TradesTable trades={trades} search={listParams.toString()} />
      )}
    </TradesWorkspace>
  );
}
