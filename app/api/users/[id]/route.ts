import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userRole = (session.user as { role?: string })?.role
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const updateData: {
    name?: string
    email?: string
    role?: 'admin' | 'agent'
    active?: boolean
    password?: string
  } = {}

  if (body.name !== undefined) updateData.name = body.name
  if (body.email !== undefined) updateData.email = body.email.toLowerCase()
  if (body.role !== undefined) updateData.role = body.role as 'admin' | 'agent'
  if (body.active !== undefined) updateData.active = body.active
  
  if (body.password) {
    updateData.password = await bcrypt.hash(body.password, 10)
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json(user)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userRole = (session.user as { role?: string })?.role
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params

  await prisma.user.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
