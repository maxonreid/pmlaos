import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Admin Dashboard - Clients Logic', () => {
  it('should fetch clients with listings relationship', async () => {
    const clients = await prisma.client.findMany({
      include: {
        listings: {
          select: { listingId: true },
        },
      },
      take: 5,
    })

    expect(Array.isArray(clients)).toBe(true)
    
    if (clients.length > 0) {
      const client = clients[0]
      expect(client).toHaveProperty('id')
      expect(client).toHaveProperty('name')
      expect(client).toHaveProperty('whatsapp')
      expect(client).toHaveProperty('status')
      expect(client).toHaveProperty('listings')
      expect(Array.isArray(client.listings)).toBe(true)
    }
  })

  it('should validate client status enum values', async () => {
    const clients = await prisma.client.findMany({ take: 10 })
    
    const validStatuses = ['new', 'active', 'closed', 'lost']
    
    clients.forEach(client => {
      expect(validStatuses).toContain(client.status)
    })
  })

  it('should validate client source enum values', async () => {
    const clients = await prisma.client.findMany({ take: 10 })
    
    const validSources = ['website', 'referral', 'direct', 'other']
    
    clients.forEach(client => {
      expect(validSources).toContain(client.source)
    })
  })

  it('should handle budget conversion from Decimal to Number', async () => {
    const clientsRaw = await prisma.client.findMany({
      where: {
        budgetMin: { not: null }
      },
      take: 5,
    })

    clientsRaw.forEach(client => {
      if (client.budgetMin) {
        const budgetAsNumber = Number(client.budgetMin)
        expect(typeof budgetAsNumber).toBe('number')
        expect(budgetAsNumber).toBeGreaterThan(0)
      }
      
      if (client.budgetMax) {
        const budgetAsNumber = Number(client.budgetMax)
        expect(typeof budgetAsNumber).toBe('number')
        expect(budgetAsNumber).toBeGreaterThan(0)
      }
    })
  })

  it('should fetch active users for assignment', async () => {
    const users = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true },
    })

    expect(Array.isArray(users)).toBe(true)
    
    users.forEach(user => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(typeof user.id).toBe('string')
      expect(typeof user.name).toBe('string')
    })
  })
})
