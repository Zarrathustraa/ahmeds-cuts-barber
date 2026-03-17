import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: "Ahmed's Cuts - Premium Barber Shop",
  description: 'Professional haircuts, beard trims, and grooming services in the heart of the city. Book your appointment online.',
  keywords: 'barber, haircut, beard trim, grooming, barbershop',
  openGraph: {
    title: "Ahmed's Cuts - Premium Barber Shop",
    description: 'Book your appointment online for professional haircuts and grooming.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid #374151' },
            success: { iconTheme: { primary: '#d97706', secondary: '#fff' } },
          }}
        />
        {children}
      </body>
    </html>
  )
}
