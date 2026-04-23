"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResultBookList } from "@/components/Search/search-result-book-list/searchResultBookList";
import { SearchResultLibraryList } from "@/components/Search/search-result-library-list/searchResultLibraryList";
import { SearchResultTopBox } from "@/components/Search/search-result-top-box/searchResultTopBox";
import type { SearchRadiusKm } from "@/type/search";
import styles from "./searchListPage.module.css";

function SearchListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get("query") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<SearchRadiusKm>(30);
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    const nextSearchParams = new URLSearchParams(searchParams?.toString());

    if (trimmedQuery) {
      nextSearchParams.set("query", trimmedQuery);
    } else {
      nextSearchParams.delete("query");
    }

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
          onRadiusChange={setSelectedRadiusKm}
          onAvailabilityChange={setAvailabilityOnly}
        />
        <SearchResultBookList
          selectedBookId={selectedBookId}
          onSelectBook={setSelectedBookId}
        />
        <SearchResultLibraryList />
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
