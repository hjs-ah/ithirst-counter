import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "iThirst — Water Case Tracker",
  description:
    "Tracking cases of water given to the iThirst Street Evangelism ministry at Verity Outreach Worship Center.",
};

// Prevents a light/dark flash on load by applying the saved theme
// before React hydrates.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("ithirst-theme");
    var theme = stored === "dark" ? "dark" : "light";
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body bg-mist-50 text-ink-900 dark:bg-mist-900 dark:text-mist-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
