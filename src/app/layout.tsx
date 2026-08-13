import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'EVOLVE — Personal Growth OS',
  description: 'Personal productivity, job hunting, and study dashboard for Sunil Baghel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0A0A0A] text-neutral-100 min-h-screen antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
