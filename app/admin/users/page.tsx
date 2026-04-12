import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import UsersManager from '@/components/admin/UsersManager/UsersManager'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }

  const userRole = (session.user as { role?: string }).role
  if (userRole !== 'admin') {
    redirect('/admin')
  }

  const user = {
    name: session.user.name || 'Admin',
    role: userRole || 'admin',
    image: session.user.image,
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  })

  return (
    <AdminLayout
      user={user}
      pageTitle="User Management"
      pageDescription="Manage admin and agent access to the system."
    >
      <UsersManager initialUsers={users} />
    </AdminLayout>
  )
}
