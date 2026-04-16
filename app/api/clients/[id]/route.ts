import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

function notFound() {
  return NextResponse.json({ error: 'Client not found.' }, { status: 404 })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return unauthorized()

  const { id } = await params
  const body = await req.json()

  try {
    const client = await prisma.$transaction(async (tx) => {
      const updated = await tx.client.update({
        where: { id },
        data: {
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email ?? null,
          nationality: body.nationality ?? null,
          gender: body.gender ?? null,
          speakLaoThai: body.speakLaoThai ?? false,
          speakEnglish: body.speakEnglish ?? false,
          language: body.language ?? 'en',
          interestType: body.interestType ?? 'any',
          budgetMin: body.budgetMin ?? null,
          budgetMax: body.budgetMax ?? null,
          notes: body.notes ?? null,
          status: body.status ?? 'new',
          source: body.source ?? 'direct',
          assignedTo: body.assignedTo ?? null,
        },
      })

      if (Array.isArray(body.interestedPropertyIds)) {
        await tx.clientListing.deleteMany({ where: { clientId: id } })
        if (body.interestedPropertyIds.length > 0) {
          await tx.clientListing.createMany({
            data: body.interestedPropertyIds.map((listingId: string) => ({
              clientId: id,
              listingId,
            })),
          })
        }
      }

      return updated
    })
    return NextResponse.json(client)
  } catch {
    return notFound()
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return unauthorized()
  if ((session.user as { role?: string }).role !== 'admin') return forbidden()

  const { id } = await params
  try {
    await prisma.client.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return notFound()
  }
}
