import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Fireside Chat",
    template: "%s | Fireside Chat",
  },
  description:
    "Hear directly from current and former members of Congress through their podcasts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/">
              Fireside Chat
            </Link>
            <span className="tagline">Hear them yourself.</span>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
