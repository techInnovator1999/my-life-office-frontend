import { MainLayout } from '@/components/layout/MainLayout'

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

