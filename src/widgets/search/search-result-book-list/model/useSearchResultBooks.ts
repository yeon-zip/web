"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSearchResultBooks,
  type SearchResultBook,
} from "../api/searchResultBooksApi";

export function useSearchResultBooks() {
  const searchResultBooksQuery = useQuery({
    queryKey: ["search", "result-books"],
    queryFn: getSearchResultBooks,
  });

  return {
    books: (searchResultBooksQuery.data ?? []) as SearchResultBook[],
    isError: searchResultBooksQuery.isError,
    isLoading: searchResultBooksQuery.isLoading,
  };
}
