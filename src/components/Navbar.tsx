"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#practice-heading", label: "Practice" },
  {
    href: "https://github.com/TechArc-io/studylab-practice/tree/main/assignments",
    label: "Assignments",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav className="site-nav" aria-label="Primary">
      <Link className="site-nav__brand" href="/">
        Astudylab
      </Link>

      <button
        ref={toggleRef}
        type="button"
        className="site-nav__toggle"
        aria-label={
          isOpen ? "Close navigation menu" : "Open navigation menu"
        }
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">☰</span>
      </button>

      <div
        id="primary-navigation"
        className={`site-nav__links ${
          isOpen ? "site-nav__links--open" : ""
        }`}
      >
        {links.map((link) =>
          link.href.startsWith("http") ? (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}