import { HomeSearchHero } from "@/components/Home/home-search-hero/homeSearchHero";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <section className={styles.page}>
      <HomeSearchHero />
    </section>
  );
}
