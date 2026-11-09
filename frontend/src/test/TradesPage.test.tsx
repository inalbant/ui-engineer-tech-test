import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import TradesPage from "@/app/trades/page";
import { renderWithProviders } from "./helpers";

const mocks = vi.hoisted(() => ({
  search: "",
  listTrades: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(mocks.search),
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock("@/lib/api/tradesApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api/tradesApi")>()),
  useListTradesQuery: mocks.listTrades,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.search = "";
  window.history.replaceState(null, "", "/trades");
  mocks.listTrades.mockReturnValue({ data: [], isLoading: false, isError: false });
});

describe("TradesPage status filtering", () => {
  it("retains rapid selections even before search params rerender", () => {
    const view = renderWithProviders(<TradesPage />);

    // Keep the hook's snapshot stale to reproduce clicks before URL state rerenders.
    fireEvent.click(screen.getByRole("button", { name: /dispute/i }));
    fireEvent.click(screen.getByRole("button", { name: /submitted/i }));
    expect(new URLSearchParams(window.location.search).getAll("status")).toEqual([
      "dispute",
      "submitted",
    ]);

    // Next.js supplies this updated snapshot after the native history update.
    mocks.search = window.location.search;
    view.rerender(<TradesPage />);
    expect(screen.getByRole("button", { name: /dispute/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /submitted/i })).toHaveAttribute("aria-pressed", "true");
    expect(mocks.listTrades).toHaveBeenLastCalledWith(["dispute", "submitted"]);
  });

  it("can remove a pending selection and clear the final status", () => {
    renderWithProviders(<TradesPage />);
    const dispute = screen.getByRole("button", { name: /dispute/i });
    const submitted = screen.getByRole("button", { name: /submitted/i });

    fireEvent.click(dispute);
    fireEvent.click(submitted);
    fireEvent.click(dispute);
    expect(new URLSearchParams(window.location.search).getAll("status")).toEqual(["submitted"]);
    fireEvent.click(submitted);
    expect(window.location.pathname + window.location.search).toBe("/trades");
  });

  it("honours bookmarked filters and subsequent URL changes", () => {
    window.history.replaceState(null, "", "/trades?status=confirmed&view=desk#results");
    mocks.search = window.location.search;
    const view = renderWithProviders(<TradesPage />);
    expect(screen.getByRole("button", { name: /confirmed/i })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: /dispute/i }));
    expect(new URLSearchParams(window.location.search).getAll("status")).toEqual(["confirmed", "dispute"]);
    expect(new URLSearchParams(window.location.search).get("view")).toBe("desk");
    expect(window.location.hash).toBe("#results");

    window.history.replaceState(null, "", "/trades?status=error");
    mocks.search = window.location.search;
    view.rerender(<TradesPage />);
    expect(screen.getByRole("button", { name: /^error/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /confirmed/i })).toHaveAttribute("aria-pressed", "false");
    expect(mocks.listTrades).toHaveBeenLastCalledWith(["error"]);
  });
});
