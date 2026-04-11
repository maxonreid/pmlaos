-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'agent');

-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('house', 'apartment', 'land');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('sale', 'rent');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('available', 'sold', 'rented', 'hidden');

-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('total', 'per_month');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('new', 'active', 'closed', 'lost');

-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('any', 'house_rent', 'apartment_rent', 'house_sale', 'apartment_sale', 'land_sale');

-- CreateEnum
CREATE TYPE "ClientSource" AS ENUM ('website', 'referral', 'direct', 'other');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('new', 'contacted', 'converted', 'closed');

-- CreateEnum
CREATE TYPE "ListingArea" AS ENUM ('sikhottabong', 'phonxay', 'chanthabouly', 'xaysetha');

-- CreateEnum
CREATE TYPE "ClientLanguage" AS ENUM ('en', 'lo', 'zh', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'agent',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "PropertyCategory" NOT NULL,
    "transaction" "TransactionType" NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'available',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "area" "ListingArea",
    "titleEn" TEXT NOT NULL,
    "titleLo" TEXT NOT NULL,
    "titleZh" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionLo" TEXT NOT NULL,
    "descriptionZh" TEXT NOT NULL,
    "locationEn" TEXT NOT NULL,
    "locationLo" TEXT NOT NULL,
    "locationZh" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "priceUnit" "PriceUnit" NOT NULL DEFAULT 'total',
    "areaSqm" DECIMAL(10,2),
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parkingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "swimmingPool" BOOLEAN NOT NULL DEFAULT false,
    "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "nationality" TEXT,
    "gender" TEXT,
    "speakLaoThai" BOOLEAN NOT NULL DEFAULT false,
    "speakEnglish" BOOLEAN NOT NULL DEFAULT false,
    "language" "ClientLanguage" NOT NULL DEFAULT 'en',
    "interestType" "InterestType" NOT NULL DEFAULT 'any',
    "budgetMin" DECIMAL(12,2),
    "budgetMax" DECIMAL(12,2),
    "notes" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'new',
    "source" "ClientSource" NOT NULL DEFAULT 'direct',
    "lastContactAt" TIMESTAMP(3),
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientListing" (
    "clientId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientListing_pkey" PRIMARY KEY ("clientId","listingId")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "listingId" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "dealValue" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "commissionUsd" DOUBLE PRECISION NOT NULL,
    "closedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_slug_key" ON "Listing"("slug");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientListing" ADD CONSTRAINT "ClientListing_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientListing" ADD CONSTRAINT "ClientListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
