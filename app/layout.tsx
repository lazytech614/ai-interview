import type { Metadata } from "next";
import { Lora, DM_Sans, JetBrains_Mono  } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Prept",
  description: "AI Interview Prep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${dmSans.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: dark
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* HEADER  */}
            <Header />

            {/* MAIN CONTENT  */}
            <main className="min-h-screen">
              {children}
            </main>

            {/* FOOTER  */}
            <Footer />
          </ThemeProvider>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
