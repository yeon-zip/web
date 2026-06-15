"use client";

import { Modal } from "@/components/Modal/modal";
import Image from "next/image";
import { useState } from "react";
import styles from "./notificationsModal.module.css";

type NotificationsModalProps = {
  onClose: () => void;
};

type NotificationTab = "available" | "subscriptions";

type MockLoanAvailableNotification = {
  id: number;
  title: string;
  libraryName: string;
  coverImageUrl: string;
  accentClassName: string;
};

type MockNotificationSubscription = {
  id: number;
  title: string;
  libraryName: string;
  coverImageUrl: string;
  accentClassName: string;
};

const mockLoanAvailableNotifications: MockLoanAvailableNotification[] = [
  {
    id: 1,
    title: "아몬드",
    libraryName: "경상북도교육청 구미도서관",
    coverImageUrl:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434267.jpg",
    accentClassName: styles.coverOrange,
  },
  {
    id: 2,
    title: "불편한 편의점",
    libraryName: "구미시립중앙도서관",
    coverImageUrl:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791161571188.jpg",
    accentClassName: styles.coverPink,
  },
];

const mockNotificationSubscriptions: MockNotificationSubscription[] = [
  {
    id: 1,
    title: "소년이 온다",
    libraryName: "구미시립양포도서관",
    coverImageUrl:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434120.jpg",
    accentClassName: styles.coverPink,
  },
  {
    id: 2,
    title: "달러구트 꿈 백화점",
    libraryName: "경상북도교육청 구미도서관",
    coverImageUrl:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9791165341909.jpg",
    accentClassName: styles.coverBlue,
  },
];

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 5.5A2.5 2.5 0 0 1 9.5 3H18v16.5H9.5A2.5 2.5 0 0 0 7 22M7 5.5V22M7 5.5A2.5 2.5 0 0 0 4.5 8V19A3 3 0 0 0 7.5 22H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9.5 10.5v6M14.5 10.5v6M8 7l1-2h6l1 2M7.5 7l.6 10.1A2 2 0 0 0 10.1 19h3.8a2 2 0 0 0 1.99-1.89L16.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.75a4.25 4.25 0 0 0-4.25 4.25v2.12c0 .72-.2 1.43-.56 2.05L5.9 15.5A1.5 1.5 0 0 0 7.2 17.75h9.6a1.5 1.5 0 0 0 1.3-2.25l-1.29-2.33a4.09 4.09 0 0 1-.56-2.05V9A4.25 4.25 0 0 0 12 4.75ZM10.2 19a1.8 1.8 0 0 0 3.6 0"
        fill="currentColor"
      />
    </svg>
  );
}

function Cover({
  accentClassName,
  imageUrl,
  title,
}: {
  accentClassName: string;
  imageUrl: string;
  title: string;
}) {
  return (
    <div className={`${styles.cover} ${accentClassName}`}>
      <Image
        className={styles.coverImage}
        src={imageUrl}
        alt={`${title} 표지`}
        fill
        sizes="70px"
      />
      <div className={styles.coverGlow} />
      <div className={styles.coverIcon}>
        <BookIcon />
      </div>
    </div>
  );
}

function LoanAvailableList() {
  return (
    <div className={styles.list}>
      {mockLoanAvailableNotifications.map((notification) => (
        <article key={notification.id} className={styles.card}>
          <Cover
            accentClassName={notification.accentClassName}
            imageUrl={notification.coverImageUrl}
            title={notification.title}
          />

          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>{notification.title}</h4>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`${notification.title} 알림 삭제`}
              >
                <TrashIcon />
              </button>
            </div>

            <p className={styles.cardDescription}>
              {notification.libraryName}에서 대출가능 상태로 바뀌었습니다.
            </p>

            <span className={`${styles.badge} ${styles.availableBadge}`}>
              대출 가능
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

function SubscriptionList() {
  return (
    <div className={styles.list}>
      {mockNotificationSubscriptions.map((subscription) => (
        <article key={subscription.id} className={styles.card}>
          <Cover
            accentClassName={subscription.accentClassName}
            imageUrl={subscription.coverImageUrl}
            title={subscription.title}
          />

          <div className={styles.cardBody}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardTitle}>{subscription.title}</h4>
              <span className={styles.bellIcon} aria-hidden="true">
                <BellIcon />
              </span>
            </div>

            <p className={styles.cardDescription}>
              {subscription.libraryName}에서 알림 신청 중입니다.
            </p>

            <p className={styles.helperText}>
              대출가능 상태가 되면 알림으로 알려드릴게요.
            </p>

            <span className={`${styles.badge} ${styles.pendingBadge}`}>
              알림 신청중
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<NotificationTab>("available");

  return (
    <Modal
      title="알림"
      description="대출 가능 알림과 신청한 도서를 한 번에 확인할 수 있어요."
      onClose={onClose}
    >
      <div className={styles.tabs} role="tablist" aria-label="알림 종류">
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "available" ? styles.activeTab : ""
          }`}
          role="tab"
          aria-selected={activeTab === "available"}
          onClick={() => setActiveTab("available")}
        >
          대출 가능 알림
        </button>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "subscriptions" ? styles.activeTab : ""
          }`}
          role="tab"
          aria-selected={activeTab === "subscriptions"}
          onClick={() => setActiveTab("subscriptions")}
        >
          알림 신청 목록
        </button>
      </div>

      {activeTab === "available" ? <LoanAvailableList /> : null}
      {activeTab === "subscriptions" ? <SubscriptionList /> : null}
    </Modal>
  );
}
