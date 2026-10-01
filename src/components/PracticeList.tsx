"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PracticeItem } from "@/src/data/practice-items";
import {
  requestPracticeItems,
  type PracticeListRequest,
} from "@/src/lib/practice-list-request";

type RequestState =
  | { status: "loading" }
  | { status: "success"; items: PracticeItem[] }
  | { status: "empty" }
  | { status: "error"; message: string };

type PracticeListProps = {
  request?: PracticeListRequest;
};

export function PracticeList({
  request = requestPracticeItems,
}: PracticeListProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    PracticeItem["status"] | "all"
  >("all");
  const [requestState, setRequestState] = useState<RequestState>({
    status: "loading",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleRequest = useCallback(() => {
    void request()
      .then((items) => {
        if (items.length === 0) {
          setRequestState({ status: "empty" });
          return;
        }

        setRequestState({ status: "success", items });
      })
      .catch(() => {
        setRequestState({
          status: "error",
          message: "Practice items could not be loaded.",
        });
      });
  }, [request]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  const filteredItems = useMemo(() => {
    if (requestState.status !== "success") {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();

    return requestState.items.filter((item) => {
      const matchesSearch =
        !normalizedQuery ||
        `${item.title} ${item.description}`
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requestState, query, statusFilter]);

  const refresh = useCallback(() => {
    setRequestState({ status: "loading" });
    handleRequest();

    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [handleRequest]);

  return (
    <div>
      <div className="filter">
        <label htmlFor="practice-filter">Filter the backlog</label>

        <input
          ref={searchInputRef}
          id="practice-filter"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “accessible”"
          type="search"
          value={query}
        />
      </div>

      <div className="filter">
        <label htmlFor="practice-status">Filter by status</label>

        <select
          id="practice-status"
          onChange={(event) =>
            setStatusFilter(
              event.target.value as PracticeItem["status"] | "all",
            )
          }
          value={statusFilter}
        >
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="in-progress">In progress</option>
          <option value="review">Review</option>
        </select>
      </div>

      <button type="button" onClick={refresh}>
        Refresh
      </button>

      {requestState.status === "loading" && (
        <div aria-live="polite">
          <p aria-label="Loading practice items" role="status">
            Loading practice items...
          </p>
        </div>
      )}

      {requestState.status === "error" && (
        <div role="alert">
          <p>{requestState.message}</p>
        </div>
      )}

      {requestState.status === "empty" && (
        <div aria-live="polite">
          <p
            aria-label="No practice items are available"
            className="empty"
            role="status"
          >
            No practice items are available.
          </p>
        </div>
      )}

      {requestState.status === "success" &&
        (filteredItems.length ? (
          <ul aria-live="polite" className="practice-list">
            {filteredItems.map((item) => (
              <li className="practice-card" key={item.id}>
                <strong>{item.title}</strong>

                <p>{item.description}</p>

                <span className="status">{item.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p
            aria-label="No practice items match your filters"
            className="empty"
            role="status"
          >
            No practice items match your filters.
          </p>
        ))}
    </div>
  );
}