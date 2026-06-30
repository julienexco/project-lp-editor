import type { Metadata } from 'next'
import { fontVariableClasses } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'LP Studio — Upscaly Consulting',
  description: 'Éditeur MVP — vitrine Upscaly Consulting',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${fontVariableClasses} antialiased`}>{children}</body>
    </html>
  )
}
