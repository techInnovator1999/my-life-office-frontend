import { MainLayout } from '@/components/layout/MainLayout'

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MainLayout>{children}</MainLayout>
}

