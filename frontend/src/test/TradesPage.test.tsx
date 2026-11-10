import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import type { Trade } from "@/lib/schemas";
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
  mocks.listTrades.mockReset();
  mocks.search = "";
  window.history.replaceState(null, "", "/trades");
  mocks.listTrades.mockReturnValue({ data: [], isLoading: false, isError: false });
});

describe("TradesPage status filtering", () => {
  it("keeps global counts while the table follows bookmarked and changed filters", () => {
    const base = {
      counterparty_name: "Test Bank", product_type: "Swap", currency_code: "GBP",
      notional_amount: 1000, trade_date: "2025-01-01", maturity_date: null, has_notes: false,
    };
    const allTrades: Trade[] = [
      { ...base, id: "41357e8c-30a9-00ad-939b-462de645f129", trade_id: "DISPUTED", status: "dispute" },
      { ...base, id: "cc3ebdde-5ad5-cf06-364d-7c877cd0129d", trade_id: "SUBMITTED", status: "submitted" },
    ];
    mocks.listTrades.mockImplementation((statuses?: Trade["status"][]) => ({
      data: statuses ? allTrades.filter((trade) => statuses.includes(trade.status)) : allTrades,
      isLoading: false, isError: false,
    }));
    mocks.search = "?status=dispute";
    const view = renderWithProviders(<TradesPage />);
    expect(screen.getByRole("button", { name: /submitted 1/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("link", { name: "DISPUTED" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "SUBMITTED" })).not.toBeInTheDocument();

    mocks.search = "?status=submitted";
    view.rerender(<TradesPage />);
    expect(screen.getByRole("button", { name: /dispute 1/i })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: /submitted 1/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("link", { name: "SUBMITTED" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "DISPUTED" })).not.toBeInTheDocument();
  });

  it("shows unknown counts instead of false zeros when totals are unavailable", () => {
    mocks.search = "?status=dispute";
    mocks.listTrades.mockImplementation((statuses?: Trade["status"][]) => ({
      data: statuses ? [] : undefined, isLoading: false, isError: !statuses,
    }));
    renderWithProviders(<TradesPage />);
    expect(screen.getByRole("button", { name: /submitted —/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /dispute —/i })).toHaveAttribute("aria-pressed", "true");
  });

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
