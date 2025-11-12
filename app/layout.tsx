import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryClientProvider from "@/components/providers/query-client-provider";
import WhatsappBtn from "@/components/whatsapp-btn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UK Checkout",
  description: "Checkout de Universidad Kuepa MX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-uk-blue-bg`}
      >
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
          <div className="fixed bottom-1 right-1">
            <WhatsappBtn />
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
