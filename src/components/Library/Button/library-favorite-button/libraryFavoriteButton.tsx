"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkLibrary } from "@/api/bookmarkLibrary";
import { unbookmarkLibrary } from "@/api/unbookmarkLibrary";
import { getApiErrorStatus } from "@/lib/apiError";
import type {
  GetNearbyBookAvailabilityResponse,
  LibraryDetail,
} from "@/type/search";
import styles from "./libraryFavoriteButton.module.css";

type LibraryFavoriteButtonProps = {
  libraryId: string;
  initialBookmarked?: boolean;
  onClick?: (libraryId: string) => void;
};

export function LibraryFavoriteButton({
  initialBookmarked = false,
  libraryId,
  onClick,
}: LibraryFavoriteButtonProps) {
  const queryClient = useQueryClient();
  const [bookmarkedOverride, setBookmarkedOverride] = useState<{
    libraryId: string;
    value: boolean;
  } | null>(null);
  const isBookmarked =
    bookmarkedOverride?.libraryId === libraryId
      ? bookmarkedOverride.value
      : initialBookmarked;
  const applyBookmarkedState = (nextBookmarked: boolean) => {
    setBookmarkedOverride({
      libraryId,
      value: nextBookmarked,
    });
    queryClient.setQueryData<LibraryDetail>(
      ["libraries", "detail", libraryId],
      (previousLibrary) =>
        previousLibrary
          ? {
              ...previousLibrary,
              bookmarked: nextBookmarked,
            }
          : previousLibrary,
    );
    queryClient.setQueriesData<GetNearbyBookAvailabilityResponse>(
      { queryKey: ["libraries", "book-availability"] },
      (previousAvailability) =>
        previousAvailability
          ? {
              ...previousAvailability,
              items: previousAvailability.items.map((library) =>
                String(library.libraryId) === libraryId
                  ? {
                      ...library,
                      bookmarked: nextBookmarked,
                    }
                  : library,
              ),
            }
          : previousAvailability,
    );
  };

  const bookmarkMutation = useMutation({
    mutationFn: (nextBookmarked: boolean) =>
      nextBookmarked ? bookmarkLibrary(libraryId) : unbookmarkLibrary(libraryId),
    onMutate: (nextBookmarked) => {
      applyBookmarkedState(nextBookmarked);
    },
    onError: (error, nextBookmarked) => {
      const status = getApiErrorStatus(error);
      const isAlreadyInTargetState =
        (status === 409 && nextBookmarked) || (status === 404 && !nextBookmarked);

      if (isAlreadyInTargetState) {
        applyBookmarkedState(nextBookmarked);
        queryClient.invalidateQueries({ queryKey: ["bookmarks", "libraries"] });
        return;
      }

      applyBookmarkedState(isBookmarked);
    },
    onSuccess: (_, nextBookmarked) => {
      applyBookmarkedState(nextBookmarked);
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "libraries"] });
      onClick?.(libraryId);
    },
  });
  const isPending = bookmarkMutation.isPending;
  const buttonLabel = isPending
    ? "처리 중..."
    : isBookmarked
      ? "도서관 찜 해제"
      : bookmarkMutation.isError
        ? "다시 시도"
        : "도서관 찜";

  return (
    <button
      type="button"
      className={`${styles.button} ${isBookmarked ? styles.bookmarked : ""}`}
      data-library-id={libraryId}
      onClick={(event) => {
        event.stopPropagation();
        bookmarkMutation.mutate(!isBookmarked);
      }}
      disabled={isPending}
      aria-pressed={isBookmarked}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      <span className={styles.heart} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" role="img">
          <path
            className={styles.heartPath}
            d="M12 20.25 4.875 13.125a4.418 4.418 0 0 1 0-6.25 4.418 4.418 0 0 1 6.25 0L12 7.75l.875-.875a4.418 4.418 0 0 1 6.25 6.25L12 20.25Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
