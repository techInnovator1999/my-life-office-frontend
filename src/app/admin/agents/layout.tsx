import { MainLayout } from '@/components/layout/MainLayout'

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

