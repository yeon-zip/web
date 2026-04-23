"use client";

import { useState } from "react";
import { LocationSelector } from "@/components/Home/location-selector/locationSelector";
import { SearchForm } from "@/components/Search/search-form/searchForm";
import { SummaryCards } from "@/components/Search/summary-cards/summaryCards";
import type { LocationSelectorValue } from "@/type/home";
import styles from "./homeSearchHero.module.css";

export function HomeSearchHero() {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSelectorValue>("seongsu");

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <span className={styles.badge}>도서 검색</span>
          <div className={styles.heading}>
            <h1 className={styles.title}>가까운 도서관에서 책 찾기</h1>
            <p className={styles.description}>
              검색하고 싶은 도서를 검색하세요. 해당 도서를 소유중인 도서관들을
              거리순으로 보여줄게요.
            </p>
          </div>
          <div className={styles.contentBlock}>
            <LocationSelector
              selectedLocation={selectedLocation}
              onSelect={setSelectedLocation}
            />
            <SummaryCards />
          </div>
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
