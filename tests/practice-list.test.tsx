import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";import { PracticeList } from "@/src/components/PracticeList";
import type { PracticeItem } from "@/src/data/practice-items";

afterEach(() => {
  cleanup();
});

const items: PracticeItem[] = [
  {
    id: "semantic-profile",
    title: "Make the profile summary semantic",
    description: "Use landmarks and meaningful link text.",
    status: "ready",
  },
  {
    id: "validated-task-form",
    title: "Validate a task form",
    description: "Treat form input as unknown and return accessible errors.",
    status: "review",
  },
];

describe("PracticeList", () => {
  it("shows loading before the request resolves", () => {
    const request = vi.fn(
      () => new Promise<PracticeItem[]>(() => {}),
    );

    render(<PracticeList request={request} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      /loading practice items/i,
    );
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("shows successful results and filters them", async () => {
    const request = vi.fn(async () => items);

    render(<PracticeList request={request} />);

    expect(
      await screen.findByText("Make the profile summary semantic"),
    ).toBeVisible();

    fireEvent.change(
      screen.getByRole("searchbox", { name: /filter the backlog/i }),
      {
        target: { value: "semantic" },
      },
    );

    expect(
      screen.getByText("Make the profile summary semantic"),
    ).toBeVisible();
    expect(
      screen.queryByText("Validate a task form"),
    ).not.toBeInTheDocument();
  });

it("shows an empty state when the request succeeds with no items", async () => {
  const request = vi.fn(async () => []);

  render(<PracticeList request={request} />);

  expect(
    await screen.findByText("No practice items match that filter."),
  ).toBeVisible();
});
  it("shows an error instead of treating failure as empty data", async () => {
    const request = vi.fn(async () => {
      throw new Error("Request failed");
    });

    render(<PracticeList request={request} />);

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(/could not be loaded/i);

    expect(screen.queryByText(/no practice items/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeVisible();
  });

  it("retries with a fresh request and renders recovered data", async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce(new Error("Request failed"))
      .mockResolvedValueOnce(items);

    render(<PracticeList request={request} />);

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(/could not be loaded/i);

    fireEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(
      await screen.findByText("Make the profile summary semantic"),
    ).toBeVisible();

    expect(request).toHaveBeenCalledTimes(2);
  });

  it("does not duplicate the request during the initial load", async () => {
    const request = vi.fn(async () => items);

    render(<PracticeList request={request} />);

    await waitFor(() => {
      expect(request).toHaveBeenCalledTimes(1);
    });
  });
});