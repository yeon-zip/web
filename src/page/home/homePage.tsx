import { HomeSearchHero } from "@/components/Home/home-search-hero/homeSearchHero";
import styles from "./homePage.module.css";

export function HomePage() {
  return (
    <section className={styles.page}>
      <HomeSearchHero />
    </section>
  );
}
