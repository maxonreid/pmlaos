import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import ClientsManager from '@/components/admin/ClientsManager/ClientsManager'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import styles from '../admin.module.css'

export default async function AdminClientsPage() {
  const session = await auth()
  const user = {
    name: session?.user?.name ?? 'Admin',
    role: ((session?.user as { role?: string } | undefined)?.role ?? 'session required'),
    image: session?.user?.image,
  }

  const clientsRaw = await prisma.client.findMany({
    include: {
      listings: {
        select: { listingId: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const clients = clientsRaw.map(client => ({
    id: client.id,
    name: client.name,
    whatsapp: client.whatsapp,
    email: client.email,
    nationality: client.nationality,
    gender: client.gender,
    interestType: client.interestType,
    budgetMin: client.budgetMin ? Number(client.budgetMin) : null,
    budgetMax: client.budgetMax ? Number(client.budgetMax) : null,
    status: client.status,
    source: client.source,
    notes: client.notes,
    interestedPropertyIds: client.listings.map(l => l.listingId),
    assignedToId: client.assignedTo,
    speakLaoThai: client.speakLaoThai,
    speakEnglish: client.speakEnglish,
    createdAt: client.createdAt,
  }))

  const users = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true },
  })

  const listingsRaw = await prisma.listing.findMany({
    select: {
      id: true,
      titleEn: true,
      price: true,
      transaction: true,
    },
  })

  const listings = listingsRaw.map(l => ({
    id: l.id,
    titleEn: l.titleEn,
    price: Number(l.price),
    transaction: l.transaction,
  }))

  return (
    <AdminLayout
      user={user}
      pageTitle="Clients"
      pageDescription="Create, edit, and manage clients."
    >
      <div className={styles.stack}>
        <ClientsManager 
          initialClients={clients}
          activeUsers={users}
          listings={listings}
          userRole={user.role} 
        />
      </div>
    </AdminLayout>
  )
}
