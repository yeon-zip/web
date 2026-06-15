"use client";

import { useState, useSyncExternalStore } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { requestKakaoLogin } from "@/api/requestKakaoLogin";
import { voteBook } from "@/api/voteBook";
import {
  AUTH_STATE_CHANGE_EVENT,
  getStoredAuthState,
} from "@/lib/authStorage";
import type { BookDetail, VoteSummary } from "@/type/search";
import styles from "./bookVoteSection.module.css";

type BookVoteSectionProps = {
  isbn: string;
  initialVoteSummary?: VoteSummary;
};

function subscribeAuthState(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AUTH_STATE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AUTH_STATE_CHANGE_EVENT, onStoreChange);
  };
}

function normalizeVoteSummary(voteSummary?: VoteSummary): VoteSummary {
  return {
    upCount: voteSummary?.upCount ?? 0,
    downCount: voteSummary?.downCount ?? 0,
    userChoice: voteSummary?.userChoice ?? null,
  };
}

function getNextVoteSummary(voteSummary: VoteSummary) {
  if (voteSummary.userChoice === "up") {
    return voteSummary;
  }

  let nextDownCount = voteSummary.downCount;

  if (voteSummary.userChoice === "down") {
    nextDownCount = Math.max(0, nextDownCount - 1);
  }

  return {
    upCount: voteSummary.upCount + 1,
    downCount: nextDownCount,
    userChoice: "up",
  };
}

function ThumbUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 21H6.8A1.8 1.8 0 0 1 5 19.2v-6.4A1.8 1.8 0 0 1 6.8 11H10m0 10V11m0 10 4.2 0a2 2 0 0 0 1.9-1.39l1.62-5.4A2.2 2.2 0 0 0 15.61 11H13V7.9A2.9 2.9 0 0 0 10.1 5L10 11"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookVoteSection({
  isbn,
  initialVoteSummary,
}: BookVoteSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isAuthenticated = useSyncExternalStore(
    subscribeAuthState,
    getStoredAuthState,
    () => false,
  );
  const voteSummary = normalizeVoteSummary(initialVoteSummary);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recommendProgress = voteSummary.upCount > 0 ? 100 : 0;
  const recommendLabel =
    voteSummary.upCount > 0
      ? `${voteSummary.upCount}명이 추천했어요`
      : "아직 추천한 사람이 없어요";

  const voteMutation = useMutation({
    mutationFn: () => voteBook(isbn, "up"),
    onMutate: async () => {
      setErrorMessage(null);
      const queryKey = ["books", "detail", isbn] as const;
      const previousBookDetail = queryClient.getQueryData<BookDetail>(queryKey);

      if (previousBookDetail) {
        queryClient.setQueryData<BookDetail>(queryKey, {
          ...previousBookDetail,
          voteSummary: getNextVoteSummary(
            normalizeVoteSummary(previousBookDetail.voteSummary),
          ),
        });
      }

      return {
        previousBookDetail,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", "detail", isbn] });
    },
    onError: (error, _variables, context) => {
      if (context?.previousBookDetail) {
        queryClient.setQueryData(
          ["books", "detail", isbn],
          context.previousBookDetail,
        );
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "추천 상태를 반영하지 못했어요. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  const handleVoteAction = async () => {
    if (voteMutation.isPending || voteSummary.userChoice === "up") {
      return;
    }

    if (!isAuthenticated) {
      await requestKakaoLogin();
      return;
    }

    voteMutation.mutate();
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h4 className={styles.title}>독자 추천 현황</h4>
        {!isAuthenticated ? (
          <button
            type="button"
            className={styles.loginLink}
            onClick={() => router.push("/login")}
          >
            로그인하고 투표하기
          </button>
        ) : null}
      </div>

      <div
        className={styles.progressTrack}
        role="meter"
        aria-label="추천 인원"
        aria-valuemin={0}
        aria-valuemax={Math.max(voteSummary.upCount, 1)}
        aria-valuenow={voteSummary.upCount}
        aria-valuetext={recommendLabel}
      >
        <div
          className={styles.progressUp}
          style={{ width: `${recommendProgress}%` }}
        />
        <span className={styles.progressLabel}>{recommendLabel}</span>
      </div>

      <div className={styles.buttonRow}>
        <button
          type="button"
          className={`${styles.voteButton} ${
            voteSummary.userChoice === "up" ? styles.voteButtonUpActive : ""
          }`}
          aria-pressed={voteSummary.userChoice === "up"}
          disabled={voteMutation.isPending || voteSummary.userChoice === "up"}
          onClick={() => void handleVoteAction()}
        >
          <span className={styles.iconShell}>
            <ThumbUpIcon />
          </span>
          <span>
            {voteSummary.userChoice === "up" ? "추천 완료" : "추천하기"}
          </span>
        </button>
      </div>

      {errorMessage ? <p className={styles.feedbackError}>{errorMessage}</p> : null}
      {!errorMessage && voteSummary.upCount === 0 ? (
        <p className={styles.feedback}>이 책을 추천한다면 추천을 눌러주세요.</p>
      ) : null}
    </section>
  );
}
