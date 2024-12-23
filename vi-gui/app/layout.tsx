import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
if (geistSans&& geistMono) {
  console.log('Active component');
}
export const metadata: Metadata = {
  title: "Vi",
  description: "Built with sadness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <body
      >
      <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      >
        <Toaster/>
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
