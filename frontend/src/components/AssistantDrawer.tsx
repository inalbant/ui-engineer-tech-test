"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "./ui";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeAssistant } from "@/lib/slices/uiSlice";
import { useAssistantStream, type ChatMessage } from "@/lib/ws";

const Backdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 160ms ease;
  z-index: 39;
`;

const Panel = styled.aside<{ $open: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 400px;
  background: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 200ms ease;
  z-index: 40;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) =>
    `${theme.space.md} ${theme.space.lg}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.weights.semibold};
  }

  .status {
    display: flex;
    align-items: center;
    gap: 6px;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.border};
    }
    .dot.connected {
      background: ${({ theme }) => theme.colors.success};
    }
  }
`;

const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const Empty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textFaint};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Bubble = styled.div<{ $role: ChatMessage["role"] }>`
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.md};
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: ${({ theme, $role }) =>
    $role === "user" ? theme.colors.accentSoft : theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${({ $role }) => ($role === "user" ? "24px" : "0")};
  margin-right: ${({ $role }) => ($role === "assistant" ? "24px" : "0")};
`;

const InputForm = styled.form`
  padding: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.space.sm};

  input {
    flex: 1;
    padding: ${({ theme }) =>
      `${theme.space.sm} ${theme.space.md}`};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.surface};
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSizes.md};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.accent};
    }
  }
`;

export function AssistantDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.assistantOpen);
  const { messages, send, connected } = useAssistantStream();
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    send(draft);
    setDraft("");
  };

  return (
    <>
      <Backdrop $open={open} onClick={() => dispatch(closeAssistant())} />
      <Panel $open={open} aria-label="Trade assistant">
        <Header>
          <h2>Assistant</h2>
          <div className="status">
            <span className={`dot${connected ? " connected" : ""}`} />
            <Button
              $variant="ghost"
              $size="sm"
              onClick={() => dispatch(closeAssistant())}
            >
              Close
            </Button>
          </div>
        </Header>

        <Messages ref={listRef}>
          {messages.length === 0 ? (
            <Empty>
              Ask the assistant about a trade, an email thread, or anything you
              see on screen.
            </Empty>
          ) : (
            messages.map((m) => (
              <Bubble key={m.id} $role={m.role}>
                {m.content || (m.role === "assistant" ? "…" : "")}
              </Bubble>
            ))
          )}
        </Messages>

        <InputForm onSubmit={handleSubmit}>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask the assistant…"
            aria-label="Assistant message"
          />
          <Button type="submit" $size="sm" disabled={!connected}>
            Send
          </Button>
        </InputForm>
      </Panel>
    </>
  );
}
