import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AreasManagementClient from './AreasManagementClient'

export default async function AdminAreasPage() {
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
      pageTitle="Areas"
      pageDescription="Manage geographic areas for property listings."
    >
      <AreasManagementClient />
    </AdminLayout>
  )
}
