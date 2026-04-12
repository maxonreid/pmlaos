import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set')
  process.exit(1)
}

const adapter = new PrismaNeon({ connectionString: DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const defaultAreas = [
  { nameEn: 'Sikhottabong', nameLo: 'ສີໂຄດຕະບອງ', nameZh: '西科塔蓬', slug: 'sikhottabong', order: 1 },
  { nameEn: 'Phonxay', nameLo: 'ໂພນໄຊ', nameZh: '本赛', slug: 'phonxay', order: 2 },
  { nameEn: 'Chanthabouly', nameLo: 'ຈັນທະບູລີ', nameZh: '占塔布里', slug: 'chanthabouly', order: 3 },
  { nameEn: 'Xaysetha', nameLo: 'ໄຊເສດຖາ', nameZh: '赛塞塔', slug: 'xaysetha', order: 4 },
]

const demoListings = [
  {
    slug: 'demo-riverside-villa',
    category: 'house',
    transaction: 'sale',
    status: 'available',
    featured: true,
    titleEn: 'Riverside Villa Demo',
    descriptionEn: 'A preview listing with a private garden, pool, and bright open-plan living area.',
    locationEn: 'Chanthabouly, Vientiane',
    price: '485000',
    priceUnit: 'total',
    areaSqm: '320',
    bedrooms: 4,
    bathrooms: 3,
    parkingAvailable: true,
    lat: '17.9651000',
    lng: '102.6074000',
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    ],
  },
  {
    slug: 'demo-city-apartment',
    category: 'apartment',
    transaction: 'rent',
    status: 'available',
    featured: false,
    titleEn: 'City Apartment Demo',
    descriptionEn: 'A compact furnished apartment preview with balcony, Wi-Fi, and a central location.',
    locationEn: 'Xaysetha, Vientiane',
    price: '1200',
    priceUnit: 'per_month',
    areaSqm: '86',
    bedrooms: 2,
    bathrooms: 1,
    parkingAvailable: true,
    lat: '17.9515000',
    lng: '102.6321000',
    photos: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    ],
  },
  {
    slug: 'demo-land-plot',
    category: 'land',
    transaction: 'sale',
    status: 'hidden',
    featured: false,
    titleEn: 'Land Plot Demo',
    descriptionEn: 'A hidden sample listing for previewing status badges and land inventory.',
    locationEn: 'Sikhottabong, Vientiane',
    price: '210000',
    priceUnit: 'total',
    areaSqm: '950',
    bedrooms: null,
    bathrooms: null,
    parkingAvailable: false,
    lat: '17.9562000',
    lng: '102.5809000',
    photos: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    ],
  },
] as const

async function main() {
  const password = await bcrypt.hash('changeme', 12)

  await prisma.user.upsert({
    where: { email: 'admin@pmlaos.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@pmlaos.com',
      password,
      role: 'admin',
    },
  })

  for (const area of defaultAreas) {
    await prisma.area.upsert({
      where: { slug: area.slug },
      update: {},
      create: area,
    })
  }

  for (const listing of demoListings) {
    await prisma.listing.upsert({
      where: { slug: listing.slug },
      update: {
        category: listing.category,
        transaction: listing.transaction,
        status: listing.status,
        featured: listing.featured,
        titleEn: listing.titleEn,
        titleLo: listing.titleEn,
        titleZh: listing.titleEn,
        descriptionEn: listing.descriptionEn,
        descriptionLo: listing.descriptionEn,
        descriptionZh: listing.descriptionEn,
        locationEn: listing.locationEn,
        locationLo: listing.locationEn,
        locationZh: listing.locationEn,
        price: listing.price,
        priceUnit: listing.priceUnit,
        areaSqm: listing.areaSqm,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        parkingAvailable: listing.parkingAvailable ?? false,
        lat: listing.lat,
        lng: listing.lng,
        photos: {
          deleteMany: {},
          create: listing.photos.map((url, order) => ({ url, order })),
        },
      },
      create: {
        slug: listing.slug,
        category: listing.category,
        transaction: listing.transaction,
        status: listing.status,
        featured: listing.featured,
        titleEn: listing.titleEn,
        titleLo: listing.titleEn,
        titleZh: listing.titleEn,
        descriptionEn: listing.descriptionEn,
        descriptionLo: listing.descriptionEn,
        descriptionZh: listing.descriptionEn,
        locationEn: listing.locationEn,
        locationLo: listing.locationEn,
        locationZh: listing.locationEn,
        price: listing.price,
        priceUnit: listing.priceUnit,
        areaSqm: listing.areaSqm,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        parkingAvailable: listing.parkingAvailable ?? false,
        lat: listing.lat,
        lng: listing.lng,
        photos: {
          create: listing.photos.map((url, order) => ({ url, order })),
        },
      },
    })
  }

  console.log('Seeded admin user: admin@pmlaos.com / changeme')
  console.log(`Seeded ${defaultAreas.length} areas`)
  console.log(`Seeded ${demoListings.length} demo listings`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
