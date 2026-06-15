import type { Metadata } from "next";
import { AuthAppShell } from "@/components/Auth/auth-app-shell/authAppShell";
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
            <div id="modal-root" />
            <div className={styles.shell}>
              <AuthAppShell>{children}</AuthAppShell>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
