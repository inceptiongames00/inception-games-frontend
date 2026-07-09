import "./globals.css"
import Script from "next/script"
import { AuthProvider } from "@/app/context/AuthContext"
import RootLayoutClient from "@/app/components/RootLayoutClient"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Inception Games - Esports Platform</title>
        <meta
          name="description"
          content="Inception Games - Bangladesh's premier esports platform for tournaments, events, and gaming community."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Inception Games" />
        <meta property="og:title" content="Inception Games - Esports Platform" />
        <meta property="og:description" content="Bangladesh's premier esports platform for tournaments, events, and gaming community." />
        <meta property="og:image" content="https://inception-games.an.r.appspot.com/assets/updated_logo.png" />
        <meta property="og:url" content="https://inception-games.an.r.appspot.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inception Games - Esports Platform" />
        <meta name="twitter:description" content="Bangladesh's premier esports platform for tournaments, events, and gaming community." />
        <meta name="twitter:image" content="https://inception-games.an.r.appspot.com/assets/updated_logo.png" />
        <link
          href={process.env.NEXT_PUBLIC_FONTSHARE_URL}
          rel="stylesheet"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
          `}
        </Script>
      </head>
      <body
        className="bg-black text-white overflow-x-hidden"
        style={{ fontFamily: "General Sans, sans-serif" }}
      >
        <AuthProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </AuthProvider>
      </body>
    </html>
  )
}
