import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PracticeList } from "@/src/components/PracticeList";
import type { PracticeItem } from "@/src/data/practice-items";

const items: PracticeItem[] = [
  {
    id: "semantic-profile",
    title: "Make the profile summary semantic",
    description: "Use landmarks, a heading hierarchy, and meaningful link text.",
    status: "ready",
  },
  {
    id: "responsive-navigation",
    title: "Build responsive navigation",
    description: "Keep every action keyboard reachable at narrow widths.",
    status: "in-progress",
  },
  {
    id: "validated-task-form",
    title: "Validate a task form",
    description: "Treat form input as unknown and return accessible errors.",
    status: "review",
  },
];

function createRequest(result: PracticeItem[] = items) {
  return vi.fn().mockResolvedValue(result);
}

describe("PracticeList", () => {
  it("shows the loading state while the request is pending", () => {
    const request = vi.fn(
      () => new Promise<PracticeItem[]>(() => undefined),
    );

    render(<PracticeList request={request} />);

    expect(
      screen.getByRole("status", { name: /loading practice items/i }),
    ).toBeVisible();
  });

  it("shows the success state and filters by search and status", async () => {
    const request = createRequest();

    render(<PracticeList request={request} />);

    expect(
      await screen.findByText("Make the profile summary semantic"),
    ).toBeVisible();

    fireEvent.change(
      screen.getByRole("searchbox", { name: /filter the backlog/i }),
      { target: { value: "task" } },
    );

    fireEvent.change(
      screen.getByRole("combobox", { name: /filter by status/i }),
      { target: { value: "review" } },
    );

    expect(screen.getByText("Validate a task form")).toBeVisible();
    expect(
      screen.queryByText("Make the profile summary semantic"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Build responsive navigation"),
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when the request returns no items", async () => {
    const request = createRequest([]);

    render(<PracticeList request={request} />);

    expect(
      await screen.findByRole("status", {
        name: /no practice items are available/i,
      }),
    ).toBeVisible();
  });

  it("shows an empty filtered state when no item matches", async () => {
    const request = createRequest();

    render(<PracticeList request={request} />);

    await screen.findByText("Make the profile summary semantic");

    fireEvent.change(
      screen.getByRole("searchbox", { name: /filter the backlog/i }),
      { target: { value: "does not exist" } },
    );

    expect(
      screen.getByRole("status", {
        name: /no practice items match your filters/i,
      }),
    ).toBeVisible();
  });

  it("shows an error state and allows retry", async () => {
    const request = vi
      .fn<() => Promise<PracticeItem[]>>()
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce(items);

    render(<PracticeList request={request} />);

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(/could not be loaded/i);

    fireEvent.click(screen.getByRole("button", { name: /refresh/i }));

    expect(
      await screen.findByText("Make the profile summary semantic"),
    ).toBeVisible();

    expect(request).toHaveBeenCalledTimes(2);
  });

  it("keeps the search control keyboard accessible", async () => {
    const request = createRequest();

    render(<PracticeList request={request} />);

    const searchInput = await screen.findByRole("searchbox", {
      name: /filter the backlog/i,
    });

    searchInput.focus();

    expect(document.activeElement).toBe(searchInput);

    fireEvent.keyDown(searchInput, { key: "Tab" });

    const statusSelect = screen.getByRole("combobox", {
      name: /filter by status/i,
    });

    statusSelect.focus();

    expect(document.activeElement).toBe(statusSelect);
  });

  it("refreshes the list through the accessible refresh button", async () => {
  const request = createRequest();

  render(<PracticeList request={request} />);

  const searchInput = await screen.findByRole("searchbox", {
    name: /filter the backlog/i,
  });

  searchInput.focus();

  expect(document.activeElement).toBe(searchInput);

  fireEvent.click(screen.getByRole("button", { name: /refresh/i }));

  await waitFor(() => {
    expect(request).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(searchInput);
  });

  expect(
    screen.getByText("Make the profile summary semantic"),
  ).toBeVisible();
});
});