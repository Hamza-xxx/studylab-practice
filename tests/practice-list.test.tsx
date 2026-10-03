import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PracticeList } from "@/src/components/PracticeList";
import { practiceItems } from "@/src/data/practice-items";

describe("PracticeList", () => {
  it("filters by visible task content and announces an empty state", () => {
    render(<PracticeList initialItems={practiceItems} />);

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

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "no match" },
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      /no practice items/i,
    );
  });

  it("filters by the visible practice status", () => {
    render(<PracticeList initialItems={practiceItems} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: /filter the backlog/i }),
      {
        target: { value: "review" },
      },
    );

    expect(screen.getByText("Validate a task form")).toBeVisible();

    expect(
      screen.queryByText("Make the profile summary semantic"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Build responsive navigation"),
    ).not.toBeInTheDocument();
  });
});