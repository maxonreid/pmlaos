import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(clients)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const client = await prisma.client.create({
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

  return NextResponse.json(client, { status: 201 })
}
