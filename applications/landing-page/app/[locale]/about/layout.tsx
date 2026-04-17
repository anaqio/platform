import { AboutScrollNav } from '@/components/layout/AboutScrollNav'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <AboutScrollNav />
    </>
  )
}
