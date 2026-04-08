import { HomeSearchHero } from "@/widgets/home/search-hero/ui/homeSearchHero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <section className={styles.page}>
      <HomeSearchHero />
    </section>
  );
}
