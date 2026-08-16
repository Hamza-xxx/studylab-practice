import type { Metadata } from "next";
import { Navbar } from "@/src/components/Navbar";
import "./styles.css";

export const metadata: Metadata = {
  title: "Astudylab Practice",
  description: "A progressive workspace for real frontend practice.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}