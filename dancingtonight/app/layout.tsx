import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/data";
import { Tracker } from "@/components/Tracker";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Dancing Tonight: Latin dance socials in any city", template: "%s | Dancing Tonight" },
  description:
    "Find salsa, bachata, kizomba and zouk socials, festivals and classes in your city or the city you are traveling to.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Tracker />
        <header className="top">
          <Link href="/" className="logo">
            Dancing<span>Tonight</span>
          </Link>
          <nav>
            <Link href="/festivals">Festivals</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="foot">
          <p>Dancing Tonight · Salsa · Bachata · Kizomba · Zouk</p>
        </footer>
      </body>
    </html>
  );
}
