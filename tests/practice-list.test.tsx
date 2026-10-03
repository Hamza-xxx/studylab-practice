import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PracticeList } from "@/src/components/PracticeList";
import { practiceItems } from "@/src/data/practice-items";

describe("PracticeList", () => {
  it("filters by visible task content and announces an empty state", () => {
    render(<PracticeList initialItems={practiceItems} />);

    fireEvent.change(screen.getByRole("searchbox", { name: /filter the backlog/i }), {
      target: { value: "semantic" },
    });
    expect(screen.getByText("Make the profile summary semantic")).toBeVisible();
    expect(screen.queryByText("Validate a task form")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "no match" } });
    expect(screen.getByRole("status")).toHaveTextContent(/no practice items/i);
  });
  it("shows clear filters only when useful and restores all items", () => {
  render(<PracticeList initialItems={practiceItems} />);

  expect(
    screen.queryByRole("button", { name: /clear filters/i }),
  ).not.toBeInTheDocument();

  const searchbox = screen.getByRole("searchbox", {
    name: /filter the backlog/i,
  });

  fireEvent.change(searchbox, {
    target: { value: "semantic" },
  });

  expect(
    screen.getByRole("button", { name: /clear filters/i }),
  ).toBeVisible();

  expect(screen.getByText("Make the profile summary semantic")).toBeVisible();
  expect(screen.queryByText("Validate a task form")).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /clear filters/i }),
  );

  expect(searchbox).toHaveValue("");
  expect(screen.getByText("Make the profile summary semantic")).toBeVisible();
  expect(screen.getByText("Build responsive navigation")).toBeVisible();
  expect(screen.getByText("Validate a task form")).toBeVisible();

  expect(
    screen.queryByRole("button", { name: /clear filters/i }),
  ).not.toBeInTheDocument();
});
});
