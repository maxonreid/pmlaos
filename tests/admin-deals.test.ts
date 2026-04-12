import { describe, it, expect } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Admin Dashboard - Deals Logic', () => {
  it('should fetch deals with client and listing relationships', async () => {
    const deals = await prisma.deal.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
          }
        },
        listing: {
          select: {
            id: true,
            titleEn: true,
          }
        }
      },
      take: 10,
    })

    expect(Array.isArray(deals)).toBe(true)
    
    if (deals.length > 0) {
      const deal = deals[0]
      expect(deal).toHaveProperty('id')
      expect(deal).toHaveProperty('client')
      expect(deal).toHaveProperty('listing')
      expect(deal).toHaveProperty('dealValue')
      expect(deal).toHaveProperty('commission')
      expect(deal).toHaveProperty('commissionUsd')
    }
  })

  it('should validate deal value and commission are positive numbers', async () => {
    const deals = await prisma.deal.findMany({ take: 10 })

    deals.forEach(deal => {
      expect(deal.dealValue).toBeGreaterThan(0)
      expect(deal.commission).toBeGreaterThan(0)
      expect(deal.commissionUsd).toBeGreaterThan(0)
    })
  })

  it('should validate commission is less than or equal to deal value', async () => {
    const deals = await prisma.deal.findMany({ take: 10 })

    deals.forEach(deal => {
      expect(deal.commission).toBeLessThanOrEqual(deal.dealValue)
    })
  })

  it('should validate transaction type matches listing transaction', async () => {
    const deals = await prisma.deal.findMany({
      include: {
        listing: {
          select: {
            transaction: true,
          }
        }
      },
      take: 10,
    })

    const validTransactions = ['sale', 'rent']
    
    deals.forEach(deal => {
      expect(validTransactions).toContain(deal.transactionType)
      expect(deal.transactionType).toBe(deal.listing.transaction)
    })
  })

  it('should validate closedAt is a valid date', async () => {
    const deals = await prisma.deal.findMany({ take: 10 })

    deals.forEach(deal => {
      expect(deal.closedAt).toBeInstanceOf(Date)
      expect(deal.closedAt.getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  it('should validate currency field', async () => {
    const deals = await prisma.deal.findMany({ take: 10 })

    deals.forEach(deal => {
      expect(typeof deal.currency).toBe('string')
      expect(deal.currency.length).toBeGreaterThan(0)
    })
  })

  it('should calculate total commission for all deals', async () => {
    const deals = await prisma.deal.findMany()

    const totalCommission = deals.reduce((sum, deal) => sum + deal.commissionUsd, 0)
    
    expect(typeof totalCommission).toBe('number')
    expect(totalCommission).toBeGreaterThanOrEqual(0)
  })

  it('should group deals by transaction type', async () => {
    const deals = await prisma.deal.findMany()

    const saleDeals = deals.filter(d => d.transactionType === 'sale')
    const rentDeals = deals.filter(d => d.transactionType === 'rent')
    
    expect(saleDeals.length + rentDeals.length).toBe(deals.length)
  })
})
