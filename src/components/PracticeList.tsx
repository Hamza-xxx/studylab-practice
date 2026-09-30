"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { PracticeItem } from "@/src/data/practice-items";
import {
  requestPracticeItems,
  type PracticeRequest,
} from "@/src/lib/practice-request";

type PracticeListProps = {
  request?: PracticeRequest;
};

type RequestState =
  | { status: "loading" }
  | { status: "success"; items: PracticeItem[] }
  | { status: "error"; message: string };

export function PracticeList({
  request = requestPracticeItems,
}: PracticeListProps) {
  const [query, setQuery] = useState("");
  const [requestState, setRequestState] = useState<RequestState>({
    status: "loading",
  });

  const handleRequest = useCallback(() => {
    void request()
      .then((items) => {
        setRequestState({ status: "success", items });
      })
      .catch(() => {
        setRequestState({
          status: "error",
          message: "Practice items could not be loaded.",
        });
      });
  }, [request]);

  const retry = useCallback(() => {
    setRequestState({ status: "loading" });
    handleRequest();
  }, [handleRequest]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  const filteredItems = useMemo(() => {
    if (requestState.status !== "success") {
      return [];
    }

    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return requestState.items;
    }

    return requestState.items.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(normalized),
    );
  }, [requestState, query]);

  if (requestState.status === "loading") {
    return <p role="status">Loading practice items...</p>;
  }

  if (requestState.status === "error") {
    return (
      <div role="alert">
        <p>{requestState.message}</p>
        <button type="button" onClick={retry}>
          Retry
        </button>
      </div>
    );
  }

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
        <p className="empty" role="status">
          No practice items match that filter.
        </p>
      )}
    </div>
  );
}