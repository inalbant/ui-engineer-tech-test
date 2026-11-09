"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import styled from "styled-components";

const Workspace = styled.div`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 0px;
  min-height: 0;
  width: 100%;
  transition: grid-template-columns var(--duration-slow) var(--easing-standard);
  &[data-open="true"] {
    grid-template-columns: minmax(0, 1fr) 460px;
  }
  @media (max-width: 900px) {
    &, &[data-open="true"] { grid-template-columns: minmax(0, 1fr); }
    &[data-open="true"] > [data-trades-content] { visibility: hidden; }
  }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const PanelPresence = styled.div`
  min-width: 0;
  overflow: hidden;
  > aside { width: 460px; height: 100%; }
  &[inert] { pointer-events: none; }
  @media (max-width: 900px) {
    position: absolute;
    inset: 0;
    transform: translateX(100%);
    transition: transform var(--duration-slow) var(--easing-standard);
    &[data-open="true"] { transform: translateX(0); }
    > aside { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;
const Content = styled.div`
  min-width: 0;
  overflow: auto;
  padding: var(--space-stack-loose);
`;

interface WorkspaceContext {
  selectedId?: string;
  openTrade: (id: string) => void;
  closeTrade: () => void;
  trigger: RefObject<HTMLAnchorElement | null>;
}
const Context = createContext<WorkspaceContext | null>(null);
export const useTradesWorkspace = () => useContext(Context);

export function TradesWorkspace({ children, detail, selectedId }: {
  children: ReactNode;
  detail: ReactNode;
  selectedId?: string;
}) {
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const presenceRef = useRef<HTMLDivElement>(null);
  const [retainedDetail, setRetainedDetail] = useState(detail);
  const isOpen = Boolean(selectedId);

  useEffect(() => {
    if (detail) {
      setRetainedDetail(detail);
      return;
    }
    if (!retainedDetail) return;
    // Keep the outgoing panel mounted until its transition finishes. The fallback
    // also handles zero-duration/reduced motion and interrupted transitions.
    const duration = (element: HTMLElement | null) => element
      ? Math.max(...getComputedStyle(element).transitionDuration.split(",").map((value) =>
          value.trim().endsWith("ms") ? parseFloat(value) : parseFloat(value) * 1000,
        ).map((value) => Number.isFinite(value) ? value : 0))
      : 0;
    const milliseconds = Math.max(duration(workspaceRef.current), duration(presenceRef.current));
    const timeout = window.setTimeout(() => setRetainedDetail(null), milliseconds ? milliseconds + 50 : 0);
    return () => window.clearTimeout(timeout);
  }, [detail, retainedDetail]);

  const finishClosing = () => {
    if (!isOpen) setRetainedDetail(null);
  };
  const openTrade = (id: string) => {
    const url = new URL(window.location.href);
    const alreadyOpen = url.searchParams.has("trade");
    url.searchParams.set("trade", id);
    const state = { tradePanelEntry: Boolean(window.history.state?.tradePanelEntry) };
    if (alreadyOpen) {
      window.history.replaceState(state, "", `${url.pathname}${url.search}${url.hash}`);
    } else {
      window.history.pushState({ ...state, tradePanelEntry: true }, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };
  const closeTrade = () => {
    if (window.history.state?.tradePanelEntry) {
      window.history.back();
    } else {
      // A bookmarked panel has no opening list entry to go back to.
      const url = new URL(window.location.href);
      url.searchParams.delete("trade");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };
  return (
    <Context.Provider value={{ selectedId, trigger, openTrade, closeTrade }}>
      <Workspace
        ref={workspaceRef}
        data-trades-workspace
        data-open={isOpen}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === "grid-template-columns") finishClosing();
        }}
      >
        <Content data-trades-content>{children}</Content>
        <PanelPresence
          ref={presenceRef}
          data-open={isOpen}
          inert={!isOpen}
          aria-hidden={!isOpen}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === "transform") finishClosing();
          }}
        >
          {detail ?? retainedDetail}
        </PanelPresence>
      </Workspace>
    </Context.Provider>
  );
}
