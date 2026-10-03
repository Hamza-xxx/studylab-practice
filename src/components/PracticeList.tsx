"use client";

import { useMemo, useState } from "react";
import type { PracticeItem } from "@/src/data/practice-items";

export function PracticeList({ initialItems }: { initialItems: PracticeItem[] }) {
  const [query, setQuery] = useState("");
  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return initialItems;
    return initialItems.filter((item) =>
  `${item.title} ${item.description} ${item.status}`
    .toLowerCase()
    .includes(normalized),
);
  }, [initialItems, query]);

  return (
    <div>
      <div className="filter">
        <label htmlFor="practice-filter">Filter the backlog</label>
        <input
          id="practice-filter"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “accessible”"
          type="search"
          value={query}
        />
      </div>

      {filteredItems.length ? (
        <ul className="practice-list" aria-live="polite">
          {filteredItems.map((item) => (
            <li className="practice-card" key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span className="status">{item.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty" role="status">No practice items match that filter.</p>
      )}
    </div>
  );
}
