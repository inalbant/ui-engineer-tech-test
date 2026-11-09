"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button, Panel, EmptyState } from "./ui";
import { useSubmitNoteMutation } from "@/lib/api/tradesApi";
import { formatDateTime } from "@/lib/format";
import { BREAK_STATUSES, type Note, type TradeStatus } from "@/lib/schemas";

const List = styled.ol`
  margin: 0 0 var(--space-stack);
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-stack-tight);
`;
const Item = styled.li`
  padding-bottom: var(--space-row-y);
  border-bottom: var(--border-width-hairline) solid var(--border-divider);
  overflow-wrap: anywhere;
  p { margin: 0; white-space: pre-wrap; font-size: var(--text-body); line-height: var(--text-body-line-height); color: var(--fg-secondary); }
  time { display: block; margin-top: var(--space-4); font-size: var(--text-meta); line-height: var(--text-meta-line-height); color: var(--fg-tertiary); }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
  label { font-size: var(--text-label); line-height: var(--text-label-line-height); font-weight: var(--text-label-weight); color: var(--fg-tertiary); }
  textarea {
    width: 100%;
    min-height: var(--space-80);
    padding: var(--space-8) var(--space-12);
    border: var(--border-width-hairline) solid var(--border-control);
    border-radius: var(--radius-control);
    background: var(--bg-default);
    color: var(--fg-default);
    font-family: inherit;
    font-size: var(--text-control);
    line-height: var(--text-control-line-height);
    resize: vertical;
    &::placeholder { color: var(--fg-placeholder); }
    &:hover { border-color: var(--border-strong); }
    &:focus-visible { outline: none; box-shadow: var(--focus-ring); }
    @media (forced-colors: active) { &:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; } }
  }
  .row { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; justify-content: space-between; }
  .count { font-size: var(--text-meta); line-height: var(--text-meta-line-height); color: var(--fg-tertiary); font-variant-numeric: tabular-nums; }
  .error { margin: 0; font-size: var(--text-meta); line-height: var(--text-meta-line-height); color: var(--status-danger-on-subtle); }
`;

interface NotesPanelProps {
  tradeId: string;
  status: TradeStatus;
  notes: Note[];
  headingHidden?: boolean;
}

export function NotesPanel({ tradeId, status, notes, headingHidden = false }: NotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [submitNote, { isLoading, error }] = useSubmitNoteMutation();

  const canSubmit = BREAK_STATUSES.has(status);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    submitNote({ tradeId, content: draft }).then((result) => {
      if (!("error" in result)) {
        setDraft("");
      }
    });
  };

  return (
    <Panel title={`Notes (${notes.length})`} headingHidden={headingHidden}>
      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description={
            canSubmit
              ? "Add the first note to help inform future agentic processes."
              : "Notes can be added once this trade enters a break status."
          }
        />
      ) : (
        <List>
          {notes.map((n) => (
            <Item key={n.id}>
              <p>{n.content}</p>
              <time dateTime={n.created_at}>
                {formatDateTime(n.created_at)}
              </time>
            </Item>
          ))}
        </List>
      )}

      {canSubmit ? (
        <Form onSubmit={onSubmit}>
          <label htmlFor="note">Add a note</label>
          <textarea
            id="note"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a note…"
            maxLength={500}
          />
          <div className="row">
            <span className="count">{draft.length} / 500</span>
            <Button type="submit">Save note</Button>
          </div>
          {error ? (
            <p className="error">
              {"status" in error
                ? `Request failed (${error.status}).`
                : "Something went wrong. Please try again."}
            </p>
          ) : null}
          {isLoading ? null : null}
        </Form>
      ) : null}
    </Panel>
  );
}
