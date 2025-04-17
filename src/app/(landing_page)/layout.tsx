import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Context Zero AI",
  description: "Context Zero: The only context your ai agent will ever need.",
  openGraph: {
    images: ["https://ai-saas-template-aceternity.vercel.app/banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col" role="main">
      {children}
    </main>
  );
}
