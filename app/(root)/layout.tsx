import { ClerkProvider } from '@clerk/nextjs'
import { Manrope } from 'next/font/google'
import '../globals.css'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'

export const metadata = {
  title: 'Threads',
  description: 'A Next.js 14 meta Threads',
}

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={manrope.variable}>
        <body className="font-manrope">
          <Topbar />
          <main className="flex">
            <LeftSidebar />
            <section className="main-container gap-10">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
