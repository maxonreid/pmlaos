import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateDealPayload, jsonError } from '@/lib/dealForm'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const validation = validateDealPayload(body)

  if (!validation.ok) {
    return jsonError(validation.error, 400, validation.fieldErrors)
  }

  const { clientId, listingId, transactionType, dealValue, commission, closedAt, notes } = validation.data

  try {
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        clientId,
        listingId,
        transactionType,
        dealValue,
        commission,
        currency: 'USD',
        commissionUsd: commission,
        closedAt: new Date(closedAt),
        notes,
      },
    })
    return NextResponse.json(deal)
  } catch {
    return NextResponse.json({ error: 'Deal not found.' }, { status: 404 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  try {
    await prisma.deal.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: 'Deal not found.' }, { status: 404 })
  }
}
