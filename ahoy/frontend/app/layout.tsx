import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AHOY — GitHub Intelligence Platform",
  description: "AI-powered GitHub profile analysis and developer scoring. Built by Aditya Upadhyay.",
  authors: [{ name: "Aditya Upadhyay", url: "https://github.com/AdityaQQ" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
