"use client";

import styled, { css } from "styled-components";
import { useId, type ReactNode } from "react";

const PanelRoot = styled.section`
  min-width: 0;
  background: var(--bg-default);
  color: var(--fg-default);
`;
const PanelHeader = styled.header<{ $hidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-stack-tight);
  padding: var(--space-row-y);
  border-bottom: var(--border-width-hairline) solid var(--border-divider);
  h2 {
    margin: 0;
    font-size: var(--text-heading);
    line-height: var(--text-heading-line-height);
    font-weight: var(--text-heading-weight);
  }
  ${({ $hidden }) => $hidden && css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  `}

`;
const PanelBody = styled.div`
  padding: var(--space-row-y);
`;
interface PanelProps { title: string; actions?: ReactNode; children: ReactNode; headingHidden?: boolean; }
export function Panel({ title, actions, children, headingHidden = false }: PanelProps) {
  const titleId = useId();
  return (
    <PanelRoot aria-labelledby={titleId}>
      <PanelHeader $hidden={headingHidden}>
        <h2 id={titleId}>{title}</h2>
        {actions ? <div>{actions}</div> : null}
      </PanelHeader>
      <PanelBody>{children}</PanelBody>
    </PanelRoot>
  );
}
