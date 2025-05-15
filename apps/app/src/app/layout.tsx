import Header from "@/app/components/header";
import PreviewPage from "@/app/components/previewPage";
import AppProvider from "@/app/providers";
import { Box } from "@/lib/mui";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoveFlow Subscription",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AppProvider>
          <main className="flex min-h-screen flex-column justify-between">
            <Box
              sx={{
                background: "linear-gradient(180deg, #343640 0%, #343640 100%)",
                width: "30%",
                minHeight: "100vh",
                py: 6,
                // px: 4,
              }}
            >
              <Header />
              {children}
            </Box>
            <PreviewPage />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
