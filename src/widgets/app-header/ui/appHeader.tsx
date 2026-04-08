import { SignInButton } from "@/features/auth/ui/signInButton";
import { OpenFavoritesButton } from "@/features/favorites/ui/openFavoritesButton";
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
