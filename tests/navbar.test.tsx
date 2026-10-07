import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Navbar } from "@/src/components/Navbar";

afterEach(() => {
  cleanup();
});

describe("Navbar", () => {
  it("opens and closes the navigation menu", () => {
    const { container } = render(<Navbar />);
    const menu = container.querySelector("#primary-navigation");

    expect(menu).not.toHaveClass("site-nav__links--open");

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    fireEvent.click(menuButton);

    expect(menu).toHaveClass("site-nav__links--open");
    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(
      screen.getByRole("button", { name: /close navigation menu/i }),
    );

    expect(menu).not.toHaveClass("site-nav__links--open");
    expect(
      screen.getByRole("button", { name: /open navigation menu/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the navigation menu with Escape", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: /open navigation menu/i }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("returns focus to the toggle when Escape closes the menu", () => {
    render(<Navbar />);

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    fireEvent.click(menuButton);

    screen.getByRole("link", { name: "Home" }).focus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.getByRole("button", { name: /open navigation menu/i }),
    ).toHaveFocus();
  });

  it("keeps meaningful navigation links available", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Astudylab" })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );

    expect(screen.getByRole("link", { name: "Practice" })).toHaveAttribute(
      "href",
      "/#practice-heading",
    );

    expect(
      screen.getByRole("link", { name: "Assignments" }),
    ).toHaveAttribute(
      "href",
      "https://github.com/TechArc-io/studylab-practice/tree/main/assignments",
    );
  });
});