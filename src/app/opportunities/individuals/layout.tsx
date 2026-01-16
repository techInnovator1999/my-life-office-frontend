import { MainLayout } from '@/components/layout/MainLayout'

export default function IndividualsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

