import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { TradesWorkspace, useTradesWorkspace } from "@/components/TradesWorkspace";
import { renderWithProviders } from "./helpers";

function Controls() {
  const workspace = useTradesWorkspace()!;
  return <>
    <button onClick={() => workspace.openTrade("first")}>First</button>
    <button onClick={() => workspace.openTrade("second")}>Second</button>
    <button onClick={workspace.closeTrade}>Close</button>
  </>;
}

beforeEach(() => window.history.replaceState(null, "", "/trades?status=dispute&desk=fx#results"));
afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

function renderWorkspace() {
  renderWithProviders(<TradesWorkspace detail={null}><Controls /></TradesWorkspace>);
}

describe("trade panel navigation", () => {
  it("retains the closing panel inertly, then removes it even without a transition event", () => {
    vi.useFakeTimers();
    const view = render(
      <TradesWorkspace selectedId="first" detail={<aside data-testid="detail">Trade</aside>}>
        <Controls />
      </TradesWorkspace>,
    );
    view.rerender(<TradesWorkspace detail={null}><Controls /></TradesWorkspace>);
    expect(screen.getByTestId("detail").parentElement).toHaveAttribute("inert");
    expect(screen.getByTestId("detail").parentElement).toHaveAttribute("aria-hidden", "true");
    // jsdom has no CSS transition: this exercises the zero-duration fallback.
    act(() => vi.runOnlyPendingTimers());
    expect(screen.queryByTestId("detail")).not.toBeInTheDocument();
  });

  it("preserves filters and fragment, replacing subsequent trade selections", () => {
    const push = vi.spyOn(window.history, "pushState");
    const replace = vi.spyOn(window.history, "replaceState");
    renderWorkspace();
    fireEvent.click(screen.getByText("First"));
    expect(window.location.search).toBe("?status=dispute&desk=fx&trade=first");
    expect(window.location.hash).toBe("#results");
    fireEvent.click(screen.getByText("Second"));
    expect(window.location.search).toBe("?status=dispute&desk=fx&trade=second");
    expect(push).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledTimes(1);
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    fireEvent.click(screen.getByText("Close"));
    expect(back).toHaveBeenCalledOnce();
  });

  it("closes a bookmarked panel without leaving the trades page", () => {
    window.history.replaceState(null, "", "/trades?status=error&trade=first#results");
    const back = vi.spyOn(window.history, "back");
    renderWorkspace();
    fireEvent.click(screen.getByText("Close"));
    expect(window.location.pathname + window.location.search + window.location.hash).toBe("/trades?status=error#results");
    expect(back).not.toHaveBeenCalled();
  });

  it("does not copy Next internal navigation markers into native updates", () => {
    window.history.replaceState({ __NA: true, tree: "internal" }, "");
    const push = vi.spyOn(window.history, "pushState");
    renderWorkspace();
    fireEvent.click(screen.getByText("First"));
    // Next's patched history syncs search params only for external/native updates.
    expect(push.mock.calls[0][0]).toEqual({ tradePanelEntry: true });
  });
});
