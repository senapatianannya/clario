import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import SplashScreen from "@/components/SplashScreen"

export const metadata: Metadata = {
  title: "CLARIO - Master Your Next Interview",
  description: "AI-powered mock interview platform with real-time feedback and AI assistance. Developed by Ananya, Romiya, Jyoti, Biswajit",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* Splash Screen loads first */}
        <SplashScreen />

        {/* Main App */}
        <Suspense fallback={null}>{children}</Suspense>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}

