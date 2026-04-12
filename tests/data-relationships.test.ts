import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Admin Dashboard - Data Relationships', () => {
  it('should validate client-listing many-to-many relationship', async () => {
    const clientsWithListings = await prisma.client.findMany({
      include: {
        listings: {
          include: {
            listing: true,
          }
        }
      },
      where: {
        listings: {
          some: {}
        }
      },
      take: 5,
    })

    clientsWithListings.forEach(client => {
      expect(Array.isArray(client.listings)).toBe(true)
      
      client.listings.forEach(cl => {
        expect(cl).toHaveProperty('listing')
        expect(cl.listing).toHaveProperty('id')
        expect(cl.listing).toHaveProperty('titleEn')
      })
    })
  })

  it('should validate listing-photo one-to-many relationship', async () => {
    const listingsWithPhotos = await prisma.listing.findMany({
      include: {
        photos: true,
      },
      where: {
        photos: {
          some: {}
        }
      },
      take: 5,
    })

    listingsWithPhotos.forEach(listing => {
      expect(Array.isArray(listing.photos)).toBe(true)
      expect(listing.photos.length).toBeGreaterThan(0)
      
      listing.photos.forEach(photo => {
        expect(photo).toHaveProperty('url')
        expect(photo.listingId).toBe(listing.id)
      })
    })
  })

  it('should validate user-client assignment relationship', async () => {
    const clientsWithAgents = await prisma.client.findMany({
      include: {
        agent: true,
      },
      where: {
        assignedTo: { not: null }
      },
      take: 5,
    })

    clientsWithAgents.forEach(client => {
      if (client.agent) {
        expect(client.agent).toHaveProperty('id')
        expect(client.agent).toHaveProperty('name')
        expect(client.agent.id).toBe(client.assignedTo)
      }
    })
  })

  it('should validate listing-inquiry relationship', async () => {
    const listingsWithInquiries = await prisma.listing.findMany({
      include: {
        inquiries: true,
      },
      where: {
        inquiries: {
          some: {}
        }
      },
      take: 5,
    })

    listingsWithInquiries.forEach(listing => {
      expect(Array.isArray(listing.inquiries)).toBe(true)
      
      listing.inquiries.forEach(inquiry => {
        expect(inquiry).toHaveProperty('name')
        expect(inquiry).toHaveProperty('phone')
        expect(inquiry.listingId).toBe(listing.id)
      })
    })
  })

  it('should validate deal relationships are properly linked', async () => {
    const deals = await prisma.deal.findMany({
      include: {
        client: true,
        listing: true,
      },
      take: 5,
    })

    deals.forEach(deal => {
      expect(deal.client).toBeDefined()
      expect(deal.listing).toBeDefined()
      expect(deal.clientId).toBe(deal.client.id)
      expect(deal.listingId).toBe(deal.listing.id)
    })
  })
})
