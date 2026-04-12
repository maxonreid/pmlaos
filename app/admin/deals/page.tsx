import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import DealsManager from '@/components/admin/DealsManager/DealsManager'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AdminDealsPage() {
  const session = await auth()
  const user = {
    name: session?.user?.name ?? 'Admin',
    role: ((session?.user as { role?: string } | undefined)?.role ?? 'admin'),
  }

  const dealsRaw = await prisma.deal.findMany({
    include: {
      client: { select: { id: true, name: true } },
      listing: { select: { id: true, titleEn: true } },
    },
    orderBy: { closedAt: 'desc' },
  })

  const deals = dealsRaw.map(deal => ({
    id: deal.id,
    clientName: deal.client.name,
    listingTitle: deal.listing.titleEn,
    dealValue: deal.dealValue,
    commission: deal.commission,
    currency: deal.currency,
    closedAt: deal.closedAt.toISOString(),
    transactionType: deal.transactionType as 'sale' | 'rent',
    notes: deal.notes ?? undefined,
  }))

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
    title: l.titleEn,
    price: Number(l.price),
    transaction: l.transaction as 'sale' | 'rent',
  }))

  const clients = await prisma.client.findMany({
    select: {
      id: true,
      name: true,
    },
  })

  return (
    <AdminLayout
      user={user}
      pageTitle="Deals"
      pageDescription="Track closed deals and commissions."
    >
      <DealsManager 
        initialDeals={deals}
        listings={listings}
        clients={clients}
      />
    </AdminLayout>
  )
}
