import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

// Get DATABASE_URL from environment
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

  for (const village of defaultAreas) {
    await prisma.village.upsert({
      where: { slug: village.slug },
      update: {},
      create: village,
    })
  }

  console.log('Seeded admin user: admin@pmlaos.com / changeme')
  console.log(`Seeded ${defaultAreas.length} villages`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
