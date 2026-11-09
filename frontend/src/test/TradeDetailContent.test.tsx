import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { TradeDetailContent } from "@/components/TradeDetailContent";
import { renderWithProviders } from "./helpers";

vi.mock("@/lib/api/tradesApi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api/tradesApi")>()),
  useGetTradeQuery: (id: string) => ({
    data: {
      id, trade_id: "MW-123", counterparty_name: "Test Bank", status: "dispute",
      product_type: "Swap", notional_amount: 1000, currency_code: "GBP",
      trade_date: "2025-01-01", maturity_date: null, emails: [],
      notes: [{ id: 1, trade_id: id, content: "Existing note", created_at: "2025-01-01T10:00:00Z" }],
    },
  }),
}));

const firstId = "41357e8c-30a9-00ad-939b-462de645f129";

function Harness() {
  const [id, setId] = useState(firstId);
  return <>
    <button onClick={() => setId("cc3ebdde-5ad5-cf06-364d-7c877cd0129d")}>Another trade</button>
    <TradeDetailContent tradeId={id} />
  </>;
}

describe("trade detail tabs", () => {
  it("shows counts and exposes only the active tab panel", () => {
    renderWithProviders(<Harness />);
    expect(screen.getByRole("tab", { name: "Emails (0)" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Emails (0)" })).toBeVisible();
    expect(screen.queryByRole("tabpanel", { name: "Notes (1)" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Notes (1)" }));
    expect(screen.getByRole("tabpanel", { name: "Notes (1)" })).toBeVisible();
    expect(screen.getByLabelText("Add a note")).toBeVisible();
  });

  it("supports arrow keys, Home and End with a single tab stop", () => {
    renderWithProviders(<Harness />);
    const emails = screen.getByRole("tab", { name: "Emails (0)" });
    const notes = screen.getByRole("tab", { name: "Notes (1)" });
    fireEvent.keyDown(emails, { key: "ArrowRight" });
    expect(notes).toHaveFocus();
    expect(notes).toHaveAttribute("aria-selected", "true");
    expect(emails).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(notes, { key: "Home" });
    expect(emails).toHaveFocus();
    fireEvent.keyDown(emails, { key: "End" });
    expect(notes).toHaveFocus();
    fireEvent.keyDown(notes, { key: "ArrowLeft" });
    expect(emails).toHaveFocus();
  });

  it("keeps a draft across tabs but clears it when changing trade", () => {
    renderWithProviders(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Notes (1)" }));
    fireEvent.change(screen.getByLabelText("Add a note"), { target: { value: "Check the term sheet" } });
    fireEvent.click(screen.getByRole("tab", { name: "Emails (0)" }));
    fireEvent.click(screen.getByRole("tab", { name: "Notes (1)" }));
    expect(screen.getByLabelText("Add a note")).toHaveValue("Check the term sheet");
    fireEvent.click(screen.getByRole("button", { name: "Another trade" }));
    expect(screen.getByRole("tab", { name: "Emails (0)" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Notes (1)" }));
    expect(screen.getByLabelText("Add a note")).toHaveValue("");
  });
});
