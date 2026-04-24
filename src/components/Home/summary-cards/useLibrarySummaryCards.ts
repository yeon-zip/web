"use client";

import { useQuery } from "@tanstack/react-query";
import { getLibrarySummary } from "@/api/librarySummaryApi";

export function useLibrarySummaryCards() {
  const summaryQuery = useQuery({
    queryKey: ["home", "summary-cards"],
    queryFn: getLibrarySummary,
  });

  return {
    nearbyLibraryCount: summaryQuery.data?.nearbyLibraryCount ?? 0,
    openLibraryCount: summaryQuery.data?.openLibraryCount ?? 0,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
  };
}
