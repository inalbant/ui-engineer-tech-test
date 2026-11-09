"use client";

import styled from "styled-components";
import { Panel, EmptyState } from "./ui";
import { formatDateTime } from "@/lib/format";
import type { Email } from "@/lib/schemas";

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: var(--space-stack-tight);
`;
const Item = styled.li`
  min-width: 0;
  border: var(--border-width-hairline) solid var(--border-default);
  border-radius: var(--radius-control);
  padding: var(--space-row-y);
  overflow-wrap: anywhere;
`;
const ItemHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4) var(--space-stack-tight);
`;
const Who = styled.p`
  margin: 0;
  font-size: var(--text-body-compact);
  line-height: var(--text-body-compact-line-height);
  font-weight: var(--text-body-compact-weight);
`;
const Meta = styled.p`
  margin: var(--space-2) 0 0;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  color: var(--fg-tertiary);
`;
const SentAt = styled.time`
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  color: var(--fg-tertiary);
  font-variant-numeric: tabular-nums;
`;
const Subject = styled.p`
  margin: var(--space-stack-tight) 0;
  font-size: var(--text-body-compact);
  line-height: var(--text-body-compact-line-height);
`;
const Body = styled.p`
  margin: var(--space-stack-tight) 0 0;
  padding-top: var(--space-row-y);
  border-top: var(--border-width-hairline) solid var(--border-divider);
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  white-space: pre-wrap;
  color: var(--fg-secondary);
`;
export function EmailsPanel({ emails, headingHidden = false }: { emails: Email[]; headingHidden?: boolean }) {
  return (
    <Panel title={`Emails (${emails.length})`} headingHidden={headingHidden}>
      {emails.length === 0 ? (
        <EmptyState title="No emails on this trade" description="Emails from the counterparty will appear here once received." />
      ) : (
        <List>
          {emails.map(({ id, from_name, to, subject, body, sent_at }) => (
            <Item key={id}>
              <ItemHeader>
                <div><Who>{from_name}</Who><Meta>To: {to.map((r) => r.name).join(", ")}</Meta></div>
                <SentAt dateTime={sent_at ?? undefined}>{formatDateTime(sent_at)}</SentAt>
              </ItemHeader>
              {subject ? <Subject>{subject}</Subject> : null}
              {body ? <Body>{body}</Body> : null}
            </Item>
          ))}
        </List>
      )}
    </Panel>
  );
}
