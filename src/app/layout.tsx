import type { Metadata } from "next";
import { AppHeader } from "@/components/app-header/appHeader";
import { QueryProvider } from "@/components/query-provider/queryProvider";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolarStar Web",
  description: "Location-based library search web application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <div className={styles.app}>
            <div className={styles.shell}>
              <AppHeader />
              <main className={styles.content}>{children}</main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
