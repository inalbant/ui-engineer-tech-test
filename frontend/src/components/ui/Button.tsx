"use client";

import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";
interface StyleProps { $variant?: Variant; $size?: Size; }

const variantStyles = {
  primary: css`
    background: var(--brand-control);
    color: var(--brand-on-control);
    border-color: var(--brand-control);
    --button-hover: var(--state-hover-on-fill);
    --button-press: var(--state-press-on-fill);
  `,
  secondary: css`
    background: var(--bg-default);
    color: var(--fg-default);
    border-color: var(--border-default);
  `,
  ghost: css`
    background: transparent;
    color: var(--fg-secondary);
    border-color: transparent;
  `,
  danger: css`
    background: var(--status-danger-fill-strong);
    color: var(--status-danger-on-fill);
    border-color: var(--status-danger-fill-strong);
    --button-hover: var(--state-hover-on-fill);
    --button-press: var(--state-press-on-fill);
  `,
};

export const Button = styled.button.attrs<StyleProps>(({ type }) => ({
  type: type ?? "button",
}))<StyleProps>`
  --button-hover: var(--state-hover);
  --button-press: var(--state-press);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  height: ${({ $size }) => $size === "sm" ? "var(--control-sm-height)" : "var(--control-md-height)"};
  padding: 0 ${({ $size }) => $size === "sm" ? "var(--control-sm-padding-x)" : "var(--control-md-padding-x)"};
  border: var(--border-width-hairline) solid;
  border-radius: ${({ $size }) => $size === "sm" ? "var(--radius-small)" : "var(--radius-control)"};
  font-size: ${({ $size }) => $size === "sm" ? "var(--text-meta)" : "var(--text-control)"};
  line-height: ${({ $size }) => $size === "sm" ? "var(--text-meta-line-height)" : "var(--text-control-line-height)"};
  font-weight: var(--text-control-weight);
  white-space: nowrap;
  cursor: pointer;
  ${({ $variant = "primary" }) => variantStyles[$variant]}

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    transition: background var(--duration-quick) var(--easing-standard);
  }
  &:hover:not(:disabled)::after { background: var(--button-hover); }
  &:active:not(:disabled)::after { background: var(--button-press); }
  &:focus-visible { outline: none; box-shadow: var(--focus-ring); }
  &:disabled { cursor: default; opacity: var(--state-disabled-opacity); }
  @media (prefers-reduced-motion: reduce) { &::after { transition: none; } }
  @media (forced-colors: active) { &:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; } }
`;
