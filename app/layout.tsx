import type { Metadata } from "next"
import { Cinzel, EB_Garamond, Geist_Mono, IM_Fell_English } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
})

const fell = IM_Fell_English({
  subsets: ["latin"],
  variable: "--font-fell",
  style: ["normal", "italic"],
  weight: "400",
})

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "LUNEX · Compiler Engineer",
    template: "%s · LUNEX",
  },
  description:
    "Compiler engineer sailing the Grand Line of systems programming — LLVM, C/C++, Rust, x86-64.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geistMono.variable,
        cinzel.variable,
        fell.variable,
        garamond.variable,
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
