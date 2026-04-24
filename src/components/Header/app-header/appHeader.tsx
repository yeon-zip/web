import { OpenFavoritesButton } from "@/components/Header/open-favorites-button/openFavoritesButton";
import { SignInButton } from "@/components/Header/sign-in-button/signInButton";
import styles from "./appHeader.module.css";

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brandBlock}>
        <span className={styles.brand}>PolarStar</span>
      </div>

      <div className={styles.actions}>
        <OpenFavoritesButton />
        <SignInButton />
      </div>
    </header>
  );
}
