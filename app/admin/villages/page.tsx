import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import VillagesManagementClient from './VillagesManagementClient'

export default async function AdminVillagesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  const user = {
    name: session.user.name || 'Admin',
    role: (session.user as { role?: string }).role || 'admin',
    image: session.user.image,
  }

  return (
    <AdminLayout
      user={user}
      pageTitle="Villages"
      pageDescription="Manage villages for property listings."
    >
      <VillagesManagementClient />
    </AdminLayout>
  )
}
