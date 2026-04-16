import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const village = await prisma.village.findUnique({
    where: { id },
  })

  if (!village) {
    return NextResponse.json({ error: 'Village not found' }, { status: 404 })
  }

  return NextResponse.json(village)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { nameEn, nameLo, nameZh, slug: customSlug, active, order } = body

  const { id } = await params
  const existing = await prisma.village.findUnique({
    where: { id },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Village not found' }, { status: 404 })
  }

  const updateData: Record<string, unknown> = {}

  if (nameEn !== undefined) {
    updateData.nameEn = nameEn
  }
  if (customSlug !== undefined) {
    const newSlug = customSlug?.trim() || (nameEn ? generateSlug(nameEn) : existing.slug)
    if (newSlug !== existing.slug) {
      const slugExists = await prisma.village.findFirst({
        where: { slug: newSlug, id: { not: id } },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Village with this slug already exists' },
          { status: 400 }
        )
      }
      updateData.slug = newSlug
    }
  }
  if (nameLo !== undefined) updateData.nameLo = nameLo
  if (nameZh !== undefined) updateData.nameZh = nameZh
  if (active !== undefined) updateData.active = active
  if (order !== undefined) updateData.order = order

  const village = await prisma.village.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(village)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.village.findUnique({
    where: { id },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Village not found' }, { status: 404 })
  }

  const listingsCount = await prisma.listing.count({
    where: { villageId: id },
  })

  if (listingsCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete village. ${listingsCount} listings are using this village.` },
      { status: 400 }
    )
  }

  await prisma.village.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
