import styles from "./homeSearchHero.module.css";
import { SearchForm } from "@/components/Search/search-form/searchForm";
import { SummaryCards } from "@/components/Home/summary-cards/summaryCards";
import LocationSelector from "@/components/Home/location-selector/locationSelector";

export function HomeSearchHero() {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.panel}>
          <div className={styles.heading}>
            <h1 className={styles.title}>가까운 도서관에서 책 찾기</h1>
            <p className={styles.description}>
              검색하고 싶은 도서를 검색하세요. 해당 도서를 소유중인 도서관들을
              거리순으로 보여드릴게요.
            </p>
          </div>
          <div className={styles.contentBlock}>
            <LocationSelector />
            <SummaryCards />
          </div>
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
