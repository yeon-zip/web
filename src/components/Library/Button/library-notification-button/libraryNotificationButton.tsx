"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotificationSubscription } from "@/api/createNotificationSubscription";
import { deleteNotificationSubscription } from "@/api/deleteNotificationSubscription";
import { getNotificationSubscriptions } from "@/api/getNotificationSubscriptions";
import { getApiErrorMessage, getApiErrorStatus } from "@/lib/apiError";
import styles from "./libraryNotificationButton.module.css";

type LibraryNotificationButtonProps = {
  isbn: string;
  libraryId: string;
};

export function LibraryNotificationButton({
  isbn,
  libraryId,
}: LibraryNotificationButtonProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const subscriptionsQuery = useQuery({
    queryKey: ["notifications", "subscriptions"],
    queryFn: getNotificationSubscriptions,
  });
  const matchedSubscription = subscriptionsQuery.data?.find(
    (subscription) =>
      subscription.isbn === isbn && String(subscription.libraryId) === libraryId,
  );
  const isSubscribed = Boolean(matchedSubscription);
  const notificationMutation = useMutation({
    mutationFn: () =>
      isSubscribed
        ? deleteNotificationSubscription({
            isbn,
            libraryId: Number(libraryId),
          })
        : createNotificationSubscription({
            isbn,
            libraryId: Number(libraryId),
          }),
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({
        queryKey: ["notifications", "subscriptions"],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "feed"] });
    },
    onError: (error) => {
      const status = getApiErrorStatus(error);

      if (status === 404) {
        setErrorMessage(
          "알림 API가 현재 서버에 배포되어 있지 않아 신청할 수 없어요.",
        );
        return;
      }

      setErrorMessage(getApiErrorMessage(error));
    },
  });
  const isPending = notificationMutation.isPending;
  const buttonLabel = isPending
    ? "처리 중..."
    : isSubscribed
      ? "알림 해제"
      : "알림 신청";

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.button} ${isSubscribed ? styles.active : ""}`}
        onClick={() => notificationMutation.mutate()}
        disabled={isPending || subscriptionsQuery.isLoading}
        aria-pressed={isSubscribed}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        <span className={styles.bell} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" role="img">
            <path
              className={styles.bellPath}
              d="M14.4 18.25a2.5 2.5 0 0 1-4.8 0M18 9.75a6 6 0 0 0-12 0c0 3.04-1.12 4.7-2.05 5.59-.6.58-.2 1.66.63 1.66h14.84c.83 0 1.23-1.08.63-1.66C19.12 14.45 18 12.79 18 9.75Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
    </div>
  );
}
