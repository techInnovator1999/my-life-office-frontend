import { MainLayout } from '@/components/layout/MainLayout'

export default function BusinessesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

