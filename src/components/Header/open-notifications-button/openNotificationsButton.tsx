"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationCount } from "@/api/getNotificationCount";
import styles from "./openNotificationsButton.module.css";

type OpenNotificationsButtonProps = {
  onClick?: () => void;
};

export function OpenNotificationsButton({
  onClick,
}: OpenNotificationsButtonProps) {
  const notificationCountQuery = useQuery({
    queryKey: ["notifications", "count"],
    queryFn: getNotificationCount,
  });
  const count = notificationCountQuery.data?.count ?? 0;

  return (
    <button type="button" className={styles.button} onClick={onClick}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" role="img">
          <path
            d="M15 18H9m8-1V11a5 5 0 1 0-10 0v6l-1.25 1.5h12.5L17 17Zm-6 1a2 2 0 0 0 4 0"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>알림</span>
      {count > 0 ? (
        <span className={styles.badge} aria-label={`알림 ${count}개`}>
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
