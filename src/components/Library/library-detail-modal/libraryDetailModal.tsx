"use client";

import { useQuery } from "@tanstack/react-query";
import { getLibraryDetail } from "@/api/getLibraryDetail";
import { Modal } from "@/components/Modal/modal";
import type {
  LibraryClosedRule,
  LibraryDetail,
  LibraryOperatingHour,
} from "@/type/search";
import { KakaoLibraryMap } from "./kakaoLibraryMap";
import styles from "./libraryDetailModal.module.css";

type LibraryDetailModalProps = {
  libraryId: string;
  onClose: () => void;
};

const WEEKDAY_LABELS = [
  "",
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

function normalizeTime(value: string | null) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  return value.slice(0, 5);
}

function formatMeridiemTime(value: string) {
  const [rawHours, rawMinutes] = value.split(":").map(Number);
  const period = rawHours < 12 ? "오전" : "오후";
  const hours = rawHours % 12 || 12;

  if (rawMinutes === 0) {
    return `${period} ${hours}시`;
  }

  return `${period} ${hours}시 ${rawMinutes}분`;
}

function convertTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  return hours * 60 + minutes;
}

function formatOperatingHour(hour: LibraryOperatingHour) {
  if (hour.closed) {
    return "휴무";
  }

  const startTime = normalizeTime(hour.openTime);
  const endTime = normalizeTime(hour.closeTime);

  if (!startTime || !endTime) {
    return "운영시간 정보가 없어요.";
  }

  if (convertTimeToMinutes(startTime) <= convertTimeToMinutes(endTime)) {
    return `${formatMeridiemTime(startTime)} ~ ${formatMeridiemTime(endTime)}`;
  }

  return `${formatMeridiemTime(endTime)} ~ ${formatMeridiemTime(startTime)}`;
}

function formatClosedRule(rule: LibraryClosedRule) {
  if (rule.ruleType === "HOLIDAY") {
    return "법정 공휴일";
  }

  if (rule.ruleType === "WEEKLY" && rule.weekday !== null) {
    return `매주 ${WEEKDAY_LABELS[rule.weekday] ?? `${rule.weekday}요일`}`;
  }

  if (
    rule.ruleType === "MONTHLY_NTH_WEEKDAY" &&
    rule.weekday !== null &&
    rule.nthWeek !== null
  ) {
    return `매월 ${rule.nthWeek}번째 ${WEEKDAY_LABELS[rule.weekday] ?? `${rule.weekday}요일`}`;
  }

  if (rule.ruleType === "MONTHLY_DAY" && rule.monthDay !== null) {
    return `매월 ${rule.monthDay}일`;
  }

  return null;
}

function formatClosedRules(closedRules: LibraryClosedRule[]) {
  const formattedRules = closedRules
    .map(formatClosedRule)
    .filter((rule): rule is string => rule !== null);

  if (formattedRules.length === 0) {
    return "정기 휴관일 정보가 없어요.";
  }

  return formattedRules.join(", ");
}

function getOperatingHourRow(hours: LibraryOperatingHour[], weekday: number) {
  const hour = hours.find((operatingHour) => operatingHour.weekday === weekday);

  return {
    label: WEEKDAY_LABELS[weekday],
    value: hour ? formatOperatingHour(hour) : "운영시간 정보가 없어요.",
  };
}

function getOperatingHourGroups(hours: LibraryOperatingHour[]) {
  return [
    {
      title: "평일",
      rows: [2, 3, 4, 5, 6].map((weekday) =>
        getOperatingHourRow(hours, weekday),
      ),
    },
    {
      title: "주말",
      rows: [7, 1].map((weekday) => getOperatingHourRow(hours, weekday)),
    },
  ];
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.15 6-11a6 6 0 0 0-12 0c0 5.85 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 5.25 9.55 7.6a1.6 1.6 0 0 1 .2 2.02l-.86 1.28a10.05 10.05 0 0 0 4.21 4.21l1.28-.86a1.6 1.6 0 0 1 2.02.2l2.35 2.35a1.35 1.35 0 0 1 0 1.9l-.75.75c-.95.95-2.37 1.23-3.63.75A17.25 17.25 0 0 1 3.8 9.63c-.48-1.26-.2-2.68.75-3.63l.75-.75a1.35 1.35 0 0 1 1.9 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryDetailContent({ library }: { library: LibraryDetail }) {
  const operatingHourGroups = getOperatingHourGroups(
    library.weeklyOperatingHours,
  );

  return (
    <div className={styles.content}>
      <section className={styles.infoCard}>
        <div className={styles.contactList}>
          <div className={styles.contactItem}>
            <span className={styles.iconBubble}>
              <LocationIcon />
            </span>
            <div className={styles.contactText}>
              <span className={styles.label}>주소</span>
              <span className={styles.value}>{library.address}</span>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.iconBubble}>
              <PhoneIcon />
            </span>
            <div className={styles.contactText}>
              <span className={styles.label}>전화</span>
              <span className={styles.value}>
                {library.tel ?? "전화번호 정보가 없어요."}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.infoCard}>
        <h4 className={styles.sectionTitle}>운영 시간</h4>
        <div className={styles.scheduleGroups}>
          {operatingHourGroups.map((group) => (
            <div key={group.title} className={styles.scheduleGroup}>
              <h5 className={styles.scheduleGroupTitle}>{group.title}</h5>
              <dl className={styles.scheduleList}>
                {group.rows.map((row) => (
                  <div key={row.label} className={styles.scheduleRow}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.infoCard}>
        <h4 className={styles.sectionTitle}>휴관일 안내</h4>
        <dl className={styles.closedList}>
          <div className={styles.closedRow}>
            <dt>정기</dt>
            <dd>{formatClosedRules(library.closedRules)}</dd>
          </div>
          <div className={styles.closedRow}>
            <dt>예정</dt>
            <dd>예정된 휴관일이 없어요</dd>
          </div>
        </dl>
      </section>

      <section className={styles.infoCard}>
        <KakaoLibraryMap
          name={library.name}
          address={library.address}
          latitude={library.latitude}
          longitude={library.longitude}
        />
      </section>

      {library.homepageUrl ? (
        <section className={`${styles.infoCard} ${styles.linkCard}`}>
          <a
            href={library.homepageUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            홈페이지 바로가기
          </a>
        </section>
      ) : null}
    </div>
  );
}

export function LibraryDetailModal({
  libraryId,
  onClose,
}: LibraryDetailModalProps) {
  const libraryDetailQuery = useQuery({
    queryKey: ["libraries", "detail", libraryId],
    queryFn: () => getLibraryDetail({ libraryId }),
  });

  return (
    <Modal
      title={libraryDetailQuery.data?.name ?? "도서관 정보"}
      onClose={onClose}
    >
      {libraryDetailQuery.isLoading ? (
        <p className={styles.feedback}>도서관 상세 정보를 불러오는 중입니다...</p>
      ) : null}

      {libraryDetailQuery.isError ? (
        <p className={styles.error}>
          도서관 상세 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}

      {libraryDetailQuery.data ? (
        <LibraryDetailContent library={libraryDetailQuery.data} />
      ) : null}
    </Modal>
  );
}
