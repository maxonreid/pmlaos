import { prisma } from '@/lib/prisma'

export type PublicListing = {
  id: string
  slug: string
  areaSlug: string | null
  category: 'house' | 'apartment' | 'land'
  transaction: 'sale' | 'rent'
  status: 'available' | 'sold' | 'rented' | 'hidden'
  featured: boolean
  titleEn: string
  villageName: string | null
  descriptionEn: string
  price: number
  priceUnit: 'total' | 'per_month'
  areaSqm: number | null
  bedrooms: number | null
  bathrooms: number | null
  parkingAvailable: boolean
  swimmingPool: boolean
  amenities: string[]
  lat: number | null
  lng: number | null
  photos: string[]
}

export type PropertyCategory = 'house' | 'apartment' | 'land'
export type TransactionType = 'sale' | 'rent'

export type PublicFilters = {
  category?: PropertyCategory
  transaction?: TransactionType
  areaSlug?: string
  query?: string
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  minBedrooms?: number
  amenities?: string[]
}

function mapListing(raw: {
  id: string
  slug: string
  village: { slug: string; nameEn: string } | null
  category: string
  transaction: string
  status: string
  featured: boolean
  titleEn: string
  descriptionEn: string
  price: { toNumber(): number } | number
  priceUnit: string
  areaSqm: { toNumber(): number } | number | null
  bedrooms: number | null
  bathrooms: number | null
  parkingAvailable: boolean
  swimmingPool: boolean
  amenities: string[]
  lat: { toNumber(): number } | number | null
  lng: { toNumber(): number } | number | null
  photos: { url: string }[]
}): PublicListing {
  return {
    id: raw.id,
    slug: raw.slug,
    areaSlug: raw.village?.slug ?? null,
    category: raw.category as PublicListing['category'],
    transaction: raw.transaction as PublicListing['transaction'],
    status: raw.status as PublicListing['status'],
    featured: raw.featured,
    titleEn: raw.titleEn,
    villageName: raw.village?.nameEn ?? null,
    descriptionEn: raw.descriptionEn,
    price: typeof raw.price === 'number' ? raw.price : raw.price.toNumber(),
    priceUnit: raw.priceUnit as PublicListing['priceUnit'],
    areaSqm: raw.areaSqm == null ? null : typeof raw.areaSqm === 'number' ? raw.areaSqm : raw.areaSqm.toNumber(),
    bedrooms: raw.bedrooms,
    bathrooms: raw.bathrooms,
    parkingAvailable: raw.parkingAvailable,
    swimmingPool: raw.swimmingPool,
    amenities: raw.amenities,
    lat: raw.lat == null ? null : typeof raw.lat === 'number' ? raw.lat : raw.lat.toNumber(),
    lng: raw.lng == null ? null : typeof raw.lng === 'number' ? raw.lng : raw.lng.toNumber(),
    photos: raw.photos.map((p) => p.url),
  }
}

const LISTING_SELECT = {
  id: true,
  slug: true,
  village: { select: { slug: true, nameEn: true } },
  category: true,
  transaction: true,
  status: true,
  featured: true,
  titleEn: true,
  descriptionEn: true,
  price: true,
  priceUnit: true,
  areaSqm: true,
  bedrooms: true,
  bathrooms: true,
  parkingAvailable: true,
  swimmingPool: true,
  amenities: true,
  lat: true,
  lng: true,
  photos: { select: { url: true }, orderBy: { order: 'asc' as const } },
} as const

export async function getPublicListings(filters: PublicFilters = {}): Promise<PublicListing[]> {
  const { category, transaction, areaSlug, query, minPrice, maxPrice, minArea, maxArea, minBedrooms, amenities } = filters

  const rows = await prisma.listing.findMany({
    where: {
      status: 'available',
      ...(category ? { category } : {}),
      ...(transaction ? { transaction } : {}),
      ...(areaSlug ? { village: { slug: areaSlug } } : {}),
      ...(query
        ? {
            OR: [
              { titleEn: { contains: query, mode: 'insensitive' } },
              { village: { nameEn: { contains: query, mode: 'insensitive' } } },
              { descriptionEn: { contains: query, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(minPrice != null || maxPrice != null
        ? {
            price: {
              ...(minPrice != null ? { gte: minPrice } : {}),
              ...(maxPrice != null ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(minArea != null || maxArea != null
        ? {
            areaSqm: {
              ...(minArea != null ? { gte: minArea } : {}),
              ...(maxArea != null ? { lte: maxArea } : {}),
            },
          }
        : {}),
      ...(minBedrooms != null ? { bedrooms: { gte: minBedrooms } } : {}),
      ...(amenities?.length ? { amenities: { hasEvery: amenities } } : {}),
    },
    select: LISTING_SELECT,
    orderBy: { createdAt: 'desc' },
  })

  return rows.map(mapListing)
}

export async function getFeaturedListings(): Promise<PublicListing[]> {
  const rows = await prisma.listing.findMany({
    where: { featured: true, status: 'available' },
    select: LISTING_SELECT,
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
  return rows.map(mapListing)
}

export async function getSponsoredListing(): Promise<PublicListing | null> {
  const now = new Date()
  const row = await prisma.listing.findFirst({
    where: {
      sponsored: true,
      status: 'available',
      OR: [
        { sponsoredUntil: null },
        { sponsoredUntil: { gte: now } }
      ]
    },
    select: LISTING_SELECT,
    orderBy: { createdAt: 'desc' },
  })
  return row ? mapListing(row) : null
}

export async function getListingBySlug(slug: string): Promise<PublicListing | null> {
  const row = await prisma.listing.findUnique({
    where: { slug },
    select: LISTING_SELECT,
  })
  return row ? mapListing(row) : null
}

export async function getAllPublicSlugs(): Promise<string[]> {
  const rows = await prisma.listing.findMany({
    where: { status: { not: 'hidden' } },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
}

export function formatPrice(price: number, priceUnit: 'total' | 'per_month'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
  return priceUnit === 'per_month' ? `${formatted}/mo` : formatted
}
