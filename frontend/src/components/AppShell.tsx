"use client";

import styled from "styled-components";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleAssistant } from "@/lib/slices/uiSlice";
import { Button } from "./ui";
import { AssistantDrawer } from "./AssistantDrawer";

const Shell = styled.div`
  min-height: 100vh;
  &:has([data-trades-workspace]) { height: 100dvh; }
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderInner = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.space.md} ${theme.space.xl}`};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};

  span.dot {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: ${({ theme }) => theme.colors.accent};
  }

  span.name {
    font-weight: ${({ theme }) => theme.weights.semibold};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.lg};

  a {
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

const Main = styled.main`
  &:has([data-trades-workspace]) {
    display: grid;
    min-height: 0;
    max-width: none;
    padding: 0;
    overflow: hidden;
  }

  flex: 1;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: ${({ theme }) =>
    `${theme.space.xl} ${theme.space.xl}`};
`;

export function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.assistantOpen);
  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand href="/trades">
            <span className="dot" aria-hidden />
            <span className="name">Yantra</span>
          </Brand>
          <Nav>
            <Link href="/trades">Trades</Link>
            <Button
              $variant="secondary"
              $size="sm"
              onClick={() => dispatch(toggleAssistant())}
              aria-expanded={open}
            >
              Assistant
            </Button>
          </Nav>
        </HeaderInner>
      </Header>
      <Main>{children}</Main>
      <AssistantDrawer />
    </Shell>
  );
}
