"use client";

import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { AuthProvider } from "../context/AuthProvider";
import { useState } from "react";
import BugDialog from "@/components/BugDialog";

const inter = Inter({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  preload: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [bugDialogOpened, setBugDialogOpened] = useState(false);

  return (
    <html
      className={`w-[100%] h-[100%] bg-gray ${inter.className} `}
      lang="en"
      suppressHydrationWarning
    >
      <body className="w-[100%] h-[100%] text-textPrimary">
        <AuthProvider>{<>{children}</>}</AuthProvider>

        <div
          className="absolute right-[20px] bottom-[20px] w-[40px] h-[40px] bg-textPrimary rounded-full z-50 flex items-center justify-center cursor-pointer"
          onClick={() => setBugDialogOpened(true)}
        >
          <p className="text-white text-2xl font-bold">?</p>
        </div>

        {bugDialogOpened && <BugDialog setIsOpen={setBugDialogOpened} />}
      </body>
    </html>
  );
}
