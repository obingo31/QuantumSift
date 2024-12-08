import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import ErrorBoundary from '../components/ErrorBoundary'
import Navigation from '../components/Navigation'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuantumSift - Smart Contract Security Platform',
  description: 'Advanced smart contract vulnerability detection and analysis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <Navigation />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
