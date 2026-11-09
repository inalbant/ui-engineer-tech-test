"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";
import { TradeDetailContent } from "./TradeDetailContent";
import { useTradesWorkspace } from "./TradesWorkspace";
import { Button } from "./ui";

const Panel = styled.aside`
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-default);
  border-left: var(--border-width-hairline) solid var(--border-divider);
`;
const Close = styled(Button)`
  position: absolute;
  top: var(--space-row-y);
  right: var(--space-row-y);
  z-index: 1;
`;
const Body = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export function TradeDetailPanel({ tradeId }: { tradeId: string }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const workspace = useTradesWorkspace();
  const trigger = workspace?.trigger;

  useEffect(() => {
    const opener = trigger?.current;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [trigger, tradeId]);

  useEffect(() => {
    if (workspace?.selectedId) {
      closeRef.current?.focus({ preventScroll: true });
    } else if (trigger?.current?.isConnected) {
      trigger.current.focus({ preventScroll: true });
    }
  }, [workspace?.selectedId, trigger]);

  return (
    <Panel data-trade-panel aria-label="Trade details" onKeyDown={(event) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        workspace?.closeTrade();
      }
    }}>
      <Close ref={closeRef} $variant="ghost" $size="sm" aria-label="Close trade details" onClick={() => workspace?.closeTrade()}>✕</Close>
      <Body key={tradeId}><TradeDetailContent tradeId={tradeId} hasCloseControl /></Body>
    </Panel>
  );
}
