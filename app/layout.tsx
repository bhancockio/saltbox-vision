import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saltbox Vision",
  description: "Quality control for logistic centers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          "bg-[#f9f8f6] w-full h-[100vh] flex flex-col",
          inter.className
        )}
      >
        <Navbar />
        <div>{children}</div>
      </body>
    </html>
  );
}
