import { describe, it, expect, beforeAll } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Database Connection', () => {
  it('should connect to the database', async () => {
    const result = await prisma.$queryRaw`SELECT 1 as result`
    expect(result).toBeDefined()
  })

  it('should query users table', async () => {
    const users = await prisma.user.findMany({ take: 1 })
    expect(Array.isArray(users)).toBe(true)
  })

  it('should query listings table', async () => {
    const listings = await prisma.listing.findMany({ take: 1 })
    expect(Array.isArray(listings)).toBe(true)
  })

  it('should query clients table', async () => {
    const clients = await prisma.client.findMany({ take: 1 })
    expect(Array.isArray(clients)).toBe(true)
  })

  it('should query deals table', async () => {
    const deals = await prisma.deal.findMany({ take: 1 })
    expect(Array.isArray(deals)).toBe(true)
  })
})
