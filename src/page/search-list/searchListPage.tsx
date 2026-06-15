"use client";

import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getRelatedBooks } from "@/api/getRelatedBooks";
import { SearchResultBookList } from "@/components/Book/search-result-book-list/search-result-book-list/searchResultBookList";
import { SearchResultLibraryList } from "@/components/Library/search-result-library-list/searchResultLibraryList";
import { SearchResultTopBox } from "@/components/Search/search-result-top-box/searchResultTopBox";
import { getRadiusValues } from "@/lib/getRadiusValues";
import {
  getStoredSearchRadius,
  parseSearchRadius,
  setStoredSearchRadius,
} from "@/lib/searchRadiusStorage";
import { HomeSearchRadiusKm } from "@/type/radius";
import styles from "./searchListPage.module.css";

const SEARCH_RADIUS_VALUES = getRadiusValues().filter(
  (value): value is HomeSearchRadiusKm => typeof value === "number",
);

function SearchListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get("query") ?? "";
  const radiusKmParam = searchParams?.get("radiusKm");
  const initialRadius =
    parseSearchRadius(radiusKmParam) ??
    getStoredSearchRadius() ??
    SEARCH_RADIUS_VALUES[0] ??
    HomeSearchRadiusKm.TWO;

  const [query, setQuery] = useState(queryParam);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<HomeSearchRadiusKm>(
    initialRadius,
  );
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const trimmedQuery = queryParam.trim();

  const relatedBooksQuery = useQuery({
    queryKey: ["books", "search", trimmedQuery],
    queryFn: () =>
      getRelatedBooks({
        query: trimmedQuery,
        limit: 12,
      }),
    enabled: trimmedQuery.length > 0,
  });

  const selectedBook =
    relatedBooksQuery.data?.find((book) => book.bookId === selectedBookId) ??
    relatedBooksQuery.data?.[0] ??
    null;

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const nextRadius =
      parseSearchRadius(radiusKmParam) ??
      getStoredSearchRadius() ??
      SEARCH_RADIUS_VALUES[0] ??
      HomeSearchRadiusKm.TWO;

    setSelectedRadiusKm(nextRadius);
  }, [radiusKmParam]);

  useEffect(() => {
    setStoredSearchRadius(selectedRadiusKm);
  }, [selectedRadiusKm]);

  const handleRadiusChange = (radius: HomeSearchRadiusKm) => {
    setSelectedRadiusKm(radius);

    const nextSearchParams = new URLSearchParams(searchParams?.toString());
    nextSearchParams.set("radiusKm", String(radius));

    const nextQueryString = nextSearchParams.toString();
    const nextUrl = nextQueryString
      ? `/search-list?${nextQueryString}`
      : "/search-list";

    router.replace(nextUrl, { scroll: false });
  };

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    const nextSearchParams = new URLSearchParams(searchParams?.toString());

    if (trimmedQuery) {
      nextSearchParams.set("query", trimmedQuery);
    } else {
      nextSearchParams.delete("query");
    }

    nextSearchParams.set("radiusKm", String(selectedRadiusKm));

    const nextQueryString = nextSearchParams.toString();
    const nextUrl = nextQueryString
      ? `/search-list?${nextQueryString}`
      : "/search-list";

    router.push(nextUrl);
  };

  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <SearchResultTopBox
          query={query}
          selectedRadiusKm={selectedRadiusKm}
          availabilityOnly={availabilityOnly}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onRadiusChange={handleRadiusChange}
          onAvailabilityChange={setAvailabilityOnly}
        />
        <SearchResultBookList
          books={relatedBooksQuery.data ?? []}
          isError={relatedBooksQuery.isError}
          isLoading={relatedBooksQuery.isLoading}
          selectedBookId={selectedBookId}
          onSelectBook={setSelectedBookId}
        />
        <SearchResultLibraryList
          availabilityOnly={availabilityOnly}
          bookTitle={selectedBook?.title ?? trimmedQuery}
          isbn={selectedBook?.isbn ?? null}
          selectedRadiusKm={selectedRadiusKm}
        />
      </div>
    </section>
  );
}

export function SearchListPage() {
  return (
    <Suspense fallback={null}>
      <SearchListPageContent />
    </Suspense>
  );
}
