import { Geist, Geist_Mono, Inter } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: {
        default: "The Peace-Driven Leader™",
        template: "%s | MINESHA",
    },
    description:
        "Transform from burnout to breakthrough with The Peace-Driven Leader™ — a 4-phase coaching journey through Mind, Body, and Divine Identity.",
    keywords: [
        "leadership coaching",
        "peace-driven leader",
        "burnout recovery",
        "executive coaching",
        "transformation",
    ],
    authors: [{ name: "MINESHA" }],
    creator: "MINESHA",
    metadataBase: new URL("https://minesha.com"),
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://minesha.com",
        siteName: "MINESHA",
        title: "MINESHA | The Peace-Driven Leader™",
        description:
            "Transform from burnout to breakthrough with The Peace-Driven Leader™ — a 4-phase coaching journey through Mind, Body, and Divine Identity.",
    },
    twitter: {
        card: "summary_large_image",
        title: "MINESHA | The Peace-Driven Leader™",
        description:
            "Transform from burnout to breakthrough with The Peace-Driven Leader™ — a 4-phase coaching journey.",
    },
    robots: {
        index: true,
        follow: true,
    },
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

import { Toaster } from "sonner"

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
                fontMono.variable,
                "font-sans",
                inter.variable
            )}
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </body>
        </html>
    )
}
