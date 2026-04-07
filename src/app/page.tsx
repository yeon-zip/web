import { AppHeader } from "@/widgets/app-header/ui/appHeader";
import { HomeSearchHero } from "@/widgets/home/search-hero/ui/homeSearchHero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <AppHeader />

        <main className={styles.main}>
          <HomeSearchHero />
        </main>
      </div>
    </div>
  );
}
