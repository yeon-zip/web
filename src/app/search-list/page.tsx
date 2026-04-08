"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchResultBooks } from "@/widgets/search/search-result-book-list/model/useSearchResultBooks";
import { SearchResultBookList } from "@/widgets/search/search-result-book-list/ui/searchResultBookList";
import {
  SearchResultTopBox,
  type SearchRadiusKm,
} from "@/widgets/search/search-result-top-box/ui/searchResultTopBox";
import styles from "./page.module.css";

function SearchListPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") ?? "";
  const [query, setQuery] = useState(queryParam);
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<SearchRadiusKm>(30);
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const { books, isError, isLoading } = useSearchResultBooks();

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (books.length === 0) {
      setSelectedBookId("");
      return;
    }

    setSelectedBookId((currentSelectedBookId) => {
      const hasSelectedBook = books.some(
        (book) => book.bookId === currentSelectedBookId,
      );

      return hasSelectedBook ? currentSelectedBookId : books[0].bookId;
    });
  }, [books]);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    const nextSearchParams = new URLSearchParams(searchParams.toString());

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
          books={books}
          isLoading={isLoading}
          isError={isError}
          selectedBookId={selectedBookId}
          onSelectBook={setSelectedBookId}
        />
      </div>
    </section>
  );
}

export default function SearchListPage() {
  return (
    <Suspense fallback={null}>
      <SearchListPageContent />
    </Suspense>
  );
}
