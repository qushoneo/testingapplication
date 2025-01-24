import "@/styles/globals.css";

import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`w-[100%] h-[100%] ${inter.className}`} lang="en">
      <body className="w-[100%] h-[100%]">{children}</body>
    </html>
  );
}
