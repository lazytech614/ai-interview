import type { Metadata } from "next";
import { Lora, DM_Sans, JetBrains_Mono  } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import ConditionalLayout from "@/components/global/conditional-layout";
import { SuggestionWidget } from "@/components/global/suggestion-widget";
import { checkUser } from "@/lib/check.user";

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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await checkUser();

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
            {/* MAIN CONTENT  */}
            <main className="min-h-screen">
              <ConditionalLayout header={<Header />} footer={<Footer />}>
                {children}
                <SuggestionWidget userId={user?.id} />
              </ConditionalLayout>
            </main>
          </ThemeProvider>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
