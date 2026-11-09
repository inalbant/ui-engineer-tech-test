"use client";

import styled from "styled-components";

const Wrap = styled.div`
  padding: var(--space-stack-loose) var(--space-stack);
  text-align: center;
`;
const Title = styled.p`
  margin: 0;
  font-size: var(--text-body);
  line-height: var(--text-body-line-height);
  font-weight: var(--weight-medium);
  color: var(--fg-secondary);
`;
const Description = styled.p`
  margin: var(--space-4) 0 0;
  font-size: var(--text-meta);
  line-height: var(--text-meta-line-height);
  color: var(--fg-tertiary);
`;
interface EmptyStateProps { title: string; description?: string; }
export function EmptyState({ title, description }: EmptyStateProps) {
  return <Wrap><Title>{title}</Title>{description ? <Description>{description}</Description> : null}</Wrap>;
}
