import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userRole = (session.user as { role?: string })?.role
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  })

  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userRole = (session.user as { role?: string })?.role
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  })

  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
  }

  let hashedPassword = null
  if (body.password) {
    hashedPassword = await bcrypt.hash(body.password, 10)
  }

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      role: body.role ?? 'agent',
      active: body.active ?? true,
      password: hashedPassword,
    },
  })

  return NextResponse.json(user)
}
