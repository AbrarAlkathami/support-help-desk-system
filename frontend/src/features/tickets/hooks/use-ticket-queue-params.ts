"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import type {
  SortOrder,
  TicketPriority,
  TicketSortBy,
  TicketStatus,
} from "../types/ticket";

export function useTicketQueueParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPageSize = Number(
    searchParams.get("pageSize"),
  );
  
  const pageSize = [10, 20, 50].includes(
    rawPageSize,
  )
    ? rawPageSize
    : 10;
  const page =
    Number(searchParams.get("page")) || 1;

  const search =
    searchParams.get("search") || "";

  const categoryId =
    searchParams.get("category") || undefined;

  const assignee =
    searchParams.get("assignee") || undefined;

  const statusParam =
    searchParams.get("status");

  const priorityParam =
    searchParams.get("priority");

  const sortByParam =
    searchParams.get("sortBy");

  const sortOrderParam =
    searchParams.get("sortOrder");

  const status: TicketStatus[] = statusParam
    ? (statusParam.split(",") as TicketStatus[])
    : [];

  const priority: TicketPriority[] =
    priorityParam
      ? (priorityParam.split(
          ",",
        ) as TicketPriority[])
      : [];

  const sortBy: TicketSortBy =
    sortByParam === "priority" ||
    sortByParam === "created_at"
      ? sortByParam
      : "created_at";

  const sortOrder: SortOrder =
    sortOrderParam === "asc" ||
    sortOrderParam === "desc"
      ? sortOrderParam
      : "desc";

  const [searchValue, setSearchValue] =
    useState(search);

  const updateParams = useCallback(
    (
      updates: Record<
        string,
        string | null
      >,
    ) => {
      const params = new URLSearchParams(
        searchParams.toString(),
      );

      Object.entries(updates).forEach(
        ([key, value]) => {
          if (!value) {
            params.delete(key);
          } else {
            params.set(key, value);
          }
        },
      );

      router.push(
        `${pathname}?${params.toString()}`,
      );
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const value = searchValue.trim();

      if (value === search) {
        return;
      }

      updateParams({
        search: value || null,
        page: "1",
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, search, updateParams]);

  function toggleStatus(
    value: TicketStatus,
  ) {
    const next = status.includes(value)
      ? status.filter(
          (item) => item !== value,
        )
      : [...status, value];

    updateParams({
      status:
        next.length > 0
          ? next.join(",")
          : null,
      page: "1",
    });
  }

  function togglePriority(
    value: TicketPriority,
  ) {
    const next = priority.includes(value)
      ? priority.filter(
          (item) => item !== value,
        )
      : [...priority, value];

    updateParams({
      priority:
        next.length > 0
          ? next.join(",")
          : null,
      page: "1",
    });
  }

  return {
    page,
    pageSize,
    search,
    searchValue,
    setSearchValue,
    status,
    priority,
    categoryId,
    assignee,
    sortBy,
    sortOrder,
    toggleStatus,
    togglePriority,
    updateParams,
  };
}