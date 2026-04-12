import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PWAInstaller from '@/components/PWAInstaller'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'PM Real Estate',
  description: 'Property listings in Vientiane, Laos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PM Laos',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
      </head>
      <body className={inter.className}>
        <PWAInstaller />
        {children}
      </body>
    </html>
  )
}
