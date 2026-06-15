"use client";

import { useState } from "react";
import { FavoritesModal } from "@/components/Header/favorites-modal/favoritesModal";
import { NotificationsModal } from "@/components/Header/notifications-modal/notificationsModal";
import { OpenFavoritesButton } from "@/components/Header/open-favorites-button/openFavoritesButton";
import { OpenNotificationsButton } from "@/components/Header/open-notifications-button/openNotificationsButton";
import { SignInButton } from "@/components/Header/sign-in-button/signInButton";
import styles from "./appHeader.module.css";

export function AppHeader() {
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>PolarStar</span>
        </div>

        <div className={styles.actions}>
          <OpenNotificationsButton
            onClick={() => setIsNotificationsModalOpen(true)}
          />
          <OpenFavoritesButton onClick={() => setIsFavoritesModalOpen(true)} />
          <SignInButton />
        </div>
      </header>

      {isNotificationsModalOpen ? (
        <NotificationsModal
          onClose={() => setIsNotificationsModalOpen(false)}
        />
      ) : null}

      {isFavoritesModalOpen ? (
        <FavoritesModal onClose={() => setIsFavoritesModalOpen(false)} />
      ) : null}
    </>
  );
}
