import { describe, it, expect, vi, beforeEach } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Admin Dashboard Integration Tests', () => {
  describe('Dashboard Statistics', () => {
    it('should calculate total active listings', async () => {
      const activeListings = await prisma.listing.count({
        where: { status: 'active' },
      })

      expect(typeof activeListings).toBe('number')
      expect(activeListings).toBeGreaterThanOrEqual(0)
    })

    it('should calculate total active clients', async () => {
      const activeClients = await prisma.client.count({
        where: { status: 'active' },
      })

      expect(typeof activeClients).toBe('number')
      expect(activeClients).toBeGreaterThanOrEqual(0)
    })

    it('should calculate total pending deals', async () => {
      const pendingDeals = await prisma.deal.count({
        where: { status: 'pending' },
      })

      expect(typeof pendingDeals).toBe('number')
      expect(pendingDeals).toBeGreaterThanOrEqual(0)
    })

    it('should calculate total revenue from closed deals', async () => {
      const closedDeals = await prisma.deal.findMany({
        where: { status: 'closed' },
        select: { commission: true },
      })

      const totalRevenue = closedDeals.reduce(
        (sum, deal) => sum + Number(deal.commission),
        0
      )

      expect(typeof totalRevenue).toBe('number')
      expect(totalRevenue).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Recent Activity Queries', () => {
    it('should fetch recent clients', async () => {
      const recentClients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          assignedTo: {
            select: { name: true },
          },
        },
      })

      expect(Array.isArray(recentClients)).toBe(true)
      expect(recentClients.length).toBeLessThanOrEqual(5)

      recentClients.forEach(client => {
        expect(client).toHaveProperty('id')
        expect(client).toHaveProperty('name')
        expect(client).toHaveProperty('createdAt')
        expect(client.createdAt).toBeInstanceOf(Date)
      })
    })

    it('should fetch recent deals', async () => {
      const recentDeals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          client: {
            select: { name: true },
          },
          listing: {
            select: { title: true },
          },
        },
      })

      expect(Array.isArray(recentDeals)).toBe(true)
      expect(recentDeals.length).toBeLessThanOrEqual(5)

      recentDeals.forEach(deal => {
        expect(deal).toHaveProperty('id')
        expect(deal).toHaveProperty('client')
        expect(deal).toHaveProperty('listing')
      })
    })

    it('should fetch recently updated listings', async () => {
      const recentListings = await prisma.listing.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          updatedAt: true,
        },
      })

      expect(Array.isArray(recentListings)).toBe(true)
      expect(recentListings.length).toBeLessThanOrEqual(5)

      recentListings.forEach(listing => {
        expect(listing).toHaveProperty('id')
        expect(listing).toHaveProperty('title')
        expect(listing).toHaveProperty('updatedAt')
        expect(listing.updatedAt).toBeInstanceOf(Date)
      })
    })
  })

  describe('User Performance Queries', () => {
    it('should fetch user with their assigned clients count', async () => {
      const usersWithStats = await prisma.user.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              assignedClients: true,
            },
          },
        },
        take: 5,
      })

      expect(Array.isArray(usersWithStats)).toBe(true)

      usersWithStats.forEach(user => {
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('_count')
        expect(typeof user._count.assignedClients).toBe('number')
      })
    })

    it('should fetch user with their deals count', async () => {
      const usersWithDeals = await prisma.user.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              deals: true,
            },
          },
        },
        take: 5,
      })

      expect(Array.isArray(usersWithDeals)).toBe(true)

      usersWithDeals.forEach(user => {
        expect(user).toHaveProperty('_count')
        expect(typeof user._count.deals).toBe('number')
      })
    })
  })

  describe('Dashboard Filters', () => {
    it('should filter listings by status', async () => {
      const statuses = ['active', 'pending', 'sold', 'rented'] as const

      for (const status of statuses) {
        const listings = await prisma.listing.findMany({
          where: { status },
          take: 3,
        })

        listings.forEach(listing => {
          expect(listing.status).toBe(status)
        })
      }
    })

    it('should filter clients by date range', async () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-12-31')

      const clients = await prisma.client.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        take: 10,
      })

      clients.forEach(client => {
        expect(client.createdAt.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
        expect(client.createdAt.getTime()).toBeLessThanOrEqual(endDate.getTime())
      })
    })

    it('should filter deals by status and date', async () => {
      const deals = await prisma.deal.findMany({
        where: {
          status: 'pending',
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        take: 10,
      })

      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

      deals.forEach(deal => {
        expect(deal.status).toBe('pending')
        expect(deal.createdAt.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo)
      })
    })
  })

  describe('Data Aggregations', () => {
    it('should aggregate listings by property type', async () => {
      const listingsByType = await prisma.listing.groupBy({
        by: ['propertyType'],
        _count: {
          id: true,
        },
      })

      expect(Array.isArray(listingsByType)).toBe(true)

      listingsByType.forEach(group => {
        expect(group).toHaveProperty('propertyType')
        expect(group).toHaveProperty('_count')
        expect(typeof group._count.id).toBe('number')
      })
    })

    it('should aggregate clients by source', async () => {
      const clientsBySource = await prisma.client.groupBy({
        by: ['source'],
        _count: {
          id: true,
        },
      })

      expect(Array.isArray(clientsBySource)).toBe(true)

      clientsBySource.forEach(group => {
        expect(group).toHaveProperty('source')
        expect(group._count.id).toBeGreaterThan(0)
      })
    })

    it('should calculate average commission per deal', async () => {
      const dealStats = await prisma.deal.aggregate({
        _avg: {
          commission: true,
        },
        _sum: {
          commission: true,
        },
        _count: {
          id: true,
        },
        where: {
          status: 'closed',
        },
      })

      if (dealStats._count.id > 0) {
        expect(dealStats._avg.commission).toBeTruthy()
        expect(Number(dealStats._avg.commission)).toBeGreaterThan(0)
        expect(dealStats._sum.commission).toBeTruthy()
      }
    })
  })

  describe('Complex Queries with Relations', () => {
    it('should fetch listings with client interests and deals', async () => {
      const listings = await prisma.listing.findMany({
        include: {
          clients: {
            include: {
              client: {
                select: {
                  name: true,
                  whatsapp: true,
                },
              },
            },
          },
          deals: {
            select: {
              status: true,
              commission: true,
            },
          },
        },
        take: 3,
      })

      expect(Array.isArray(listings)).toBe(true)

      listings.forEach(listing => {
        expect(listing).toHaveProperty('clients')
        expect(listing).toHaveProperty('deals')
        expect(Array.isArray(listing.clients)).toBe(true)
        expect(Array.isArray(listing.deals)).toBe(true)
      })
    })

    it('should fetch clients with their listings and assigned user', async () => {
      const clients = await prisma.client.findMany({
        include: {
          listings: {
            include: {
              listing: {
                select: {
                  title: true,
                  price: true,
                  status: true,
                },
              },
            },
          },
          assignedTo: {
            select: {
              name: true,
              email: true,
            },
          },
          deals: {
            select: {
              status: true,
              commission: true,
            },
          },
        },
        take: 3,
      })

      expect(Array.isArray(clients)).toBe(true)

      clients.forEach(client => {
        expect(client).toHaveProperty('listings')
        expect(client).toHaveProperty('assignedTo')
        expect(client).toHaveProperty('deals')
      })
    })
  })
})
