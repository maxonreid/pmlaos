import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Admin Dashboard - Listings Logic', () => {
  it('should fetch listings with basic info', async () => {
    const listings = await prisma.listing.findMany({
      select: {
        id: true,
        titleEn: true,
        price: true,
        transaction: true,
      },
      take: 10,
    })

    expect(Array.isArray(listings)).toBe(true)
    
    if (listings.length > 0) {
      const listing = listings[0]
      expect(listing).toHaveProperty('id')
      expect(listing).toHaveProperty('titleEn')
      expect(listing).toHaveProperty('price')
      expect(listing).toHaveProperty('transaction')
    }
  })

  it('should handle price conversion from Decimal to Number', async () => {
    const listings = await prisma.listing.findMany({ take: 10 })

    listings.forEach(listing => {
      const priceAsNumber = Number(listing.price)
      expect(typeof priceAsNumber).toBe('number')
      expect(priceAsNumber).toBeGreaterThan(0)
    })
  })

  it('should validate listing status enum values', async () => {
    const listings = await prisma.listing.findMany({ take: 10 })
    
    const validStatuses = ['available', 'sold', 'rented', 'hidden']
    
    listings.forEach(listing => {
      expect(validStatuses).toContain(listing.status)
    })
  })

  it('should validate transaction type enum values', async () => {
    const listings = await prisma.listing.findMany({ take: 10 })
    
    const validTransactions = ['sale', 'rent']
    
    listings.forEach(listing => {
      expect(validTransactions).toContain(listing.transaction)
    })
  })

  it('should validate property category enum values', async () => {
    const listings = await prisma.listing.findMany({ take: 10 })
    
    const validCategories = ['house', 'apartment', 'land']
    
    listings.forEach(listing => {
      expect(validCategories).toContain(listing.category)
    })
  })

  it('should fetch listings with photos relationship', async () => {
    const listings = await prisma.listing.findMany({
      include: {
        photos: true,
      },
      take: 5,
    })

    expect(Array.isArray(listings)).toBe(true)
    
    listings.forEach(listing => {
      expect(listing).toHaveProperty('photos')
      expect(Array.isArray(listing.photos)).toBe(true)
    })
  })

  it('should validate area measurements when present', async () => {
    const listings = await prisma.listing.findMany({
      where: {
        areaSqm: { not: null }
      },
      take: 10,
    })

    listings.forEach(listing => {
      if (listing.areaSqm) {
        const area = Number(listing.areaSqm)
        expect(typeof area).toBe('number')
        expect(area).toBeGreaterThan(0)
      }
    })
  })

  it('should validate coordinates when present', async () => {
    const listings = await prisma.listing.findMany({
      where: {
        AND: [
          { lat: { not: null } },
          { lng: { not: null } }
        ]
      },
      take: 10,
    })

    listings.forEach(listing => {
      if (listing.lat && listing.lng) {
        const lat = Number(listing.lat)
        const lng = Number(listing.lng)
        
        expect(typeof lat).toBe('number')
        expect(typeof lng).toBe('number')
        expect(lat).toBeGreaterThanOrEqual(-90)
        expect(lat).toBeLessThanOrEqual(90)
        expect(lng).toBeGreaterThanOrEqual(-180)
        expect(lng).toBeLessThanOrEqual(180)
      }
    })
  })
})
