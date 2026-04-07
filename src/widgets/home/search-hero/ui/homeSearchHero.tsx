import { LocationSelector } from "@/features/home/location-selector/ui/locationSelector";
import { SearchForm } from "@/features/home/search-form/ui/searchForm";
import { SummaryCards } from "@/features/home/summary-cards/ui/summaryCards";
import { HOME_SEARCH_HERO_COPY } from "../model/homeSearchHeroCopy";
import styles from "./homeSearchHero.module.css";

type HomeSearchHeroProps = {
  isError: boolean;
  isLoading: boolean;
};

function HeroSkeleton() {
  return (
    <div className={styles.panel} aria-busy="true">
      <div className={styles.skeletonBadge} />
      <div className={styles.skeletonTitle} />
      <div className={styles.skeletonDescription} />
      <div className={styles.skeletonBlock}>
        <div className={styles.skeletonChipRow}>
          <span className={styles.skeletonChip} />
          <span className={styles.skeletonChip} />
          <span className={styles.skeletonChip} />
        </div>
        <div className={styles.skeletonGrid}>
          <span className={styles.skeletonCard} />
          <span className={styles.skeletonCard} />
          <span className={styles.skeletonCard} />
        </div>
        <div className={styles.skeletonSearch} />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className={styles.panel}>
      <div className={styles.errorCard}>
        홈 화면 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.
      </div>
    </div>
  );
}

export function HomeSearchHero({ isError, isLoading }: HomeSearchHeroProps) {
  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {isLoading ? (
          <HeroSkeleton />
        ) : isError ? (
          <ErrorState />
        ) : (
          <div className={styles.panel}>
            <span className={styles.badge}>
              {HOME_SEARCH_HERO_COPY.badgeLabel}
            </span>
            <div className={styles.heading}>
              <h1 className={styles.title}>{HOME_SEARCH_HERO_COPY.title}</h1>
              <p className={styles.description}>
                {HOME_SEARCH_HERO_COPY.description}
              </p>
            </div>
            <div className={styles.contentBlock}>
              <LocationSelector items={HOME_SEARCH_HERO_COPY.locationChips} />
              <SummaryCards items={HOME_SEARCH_HERO_COPY.summaryCards} />
            </div>
            <SearchForm
              buttonLabel={HOME_SEARCH_HERO_COPY.searchButtonLabel}
              placeholder={HOME_SEARCH_HERO_COPY.searchPlaceholder}
            />
          </div>
        )}
      </div>
    </section>
  );
}
