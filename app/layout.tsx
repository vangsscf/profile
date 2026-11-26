import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const description =
  "Vagner Caldeira is a senior backend and full-stack engineer building real-time fintech platforms and distributed systems with TypeScript and Node.js.";

export const metadata: Metadata = {
  title: "Vagner Caldeira | Senior Backend & Full-Stack Engineer",
  description,
  openGraph: {
    type: "website",
    title: "Vagner Caldeira | Senior Backend & Full-Stack Engineer",
    description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
