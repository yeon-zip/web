type SearchRadiusKm = 5 | 15 | 30;

type SearchResultTopBoxProps = {
  availabilityOnly: boolean;
  onAvailabilityChange: (value: boolean) => void;
  onQueryChange: (value: string) => void;
  onRadiusChange: (value: SearchRadiusKm) => void;
  onSearch: () => void;
  query: string;
  selectedRadiusKm: SearchRadiusKm;
};

import styles from "./searchResultTopBox.module.css";

const SEARCH_RADIUS_OPTIONS: SearchRadiusKm[] = [5, 15, 30];

export type { SearchRadiusKm };

export function SearchResultTopBox({
  availabilityOnly,
  onAvailabilityChange,
  onQueryChange,
  onRadiusChange,
  onSearch,
  query,
  selectedRadiusKm,
}: SearchResultTopBoxProps) {
  const title = query.trim()
    ? `"${query.trim()}" 검색 결과`
    : "도서 검색 결과";

  return (
    <section className={styles.panel}>
      <span className={styles.badge}>통합 도서 검색 결과</span>

      <div className={styles.heading}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.metaRow}>
          <p className={styles.description}>
            검색어 하나로 주변 도서관의 소장 정보와 대출 상태를 통합해서
            보여줍니다. 거리순 리스트와 대출 가능 필터를 함께 확인할 수
            있습니다.
          </p>

          <div className={styles.metaInfo}>
            <span className={styles.locationChip}>현재 위치: 성수동 기준</span>
            <span className={styles.sortLabel}>거리순 정렬</span>
          </div>
        </div>
      </div>

      <form
        className={styles.searchRow}
        role="search"
        aria-label="통합 도서 검색 결과 검색"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <div className={styles.inputShell}>
          <span className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M11 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 0c-2.761 0-5 2.239-5 5m10 0c0 2.761-2.239 5-5 5m0-10c2.761 0 5 2.239 5 5m-5 5a5 5 0 0 1 0-10m6.5 11.5L16 16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <input
            type="text"
            className={styles.input}
            value={query}
            placeholder="예: 미움받을 용기, 이호철, 97889972752870"
            aria-label="검색어 입력"
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>

        <button type="submit" className={styles.searchButton}>
          다시 검색
        </button>
      </form>

      <div className={styles.filterBar}>
        <div className={styles.radiusGroup} aria-label="검색 반경">
          {SEARCH_RADIUS_OPTIONS.map((radius) => (
            <button
              key={radius}
              type="button"
              className={`${styles.radiusButton} ${
                selectedRadiusKm === radius ? styles.radiusButtonSelected : ""
              }`}
              aria-pressed={selectedRadiusKm === radius}
              onClick={() => onRadiusChange(radius)}
            >
              {radius}km
            </button>
          ))}
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={availabilityOnly}
            onChange={(event) => onAvailabilityChange(event.target.checked)}
          />
          <span className={styles.checkboxBox} aria-hidden="true" />
          <span className={styles.checkboxText}>대출 가능한 도서관만 보기</span>
        </label>
      </div>
    </section>
  );
}
