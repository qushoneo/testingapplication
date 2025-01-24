import "@/styles/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="w-[100%] h-[100%]" lang="en">
      <body className="w-[100%] h-[100%]">{children}</body>
    </html>
  );
}
