/*
  Warnings:

  - You are about to drop the column `area` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "area",
ADD COLUMN     "areaId" TEXT;

-- DropEnum
DROP TYPE "ListingArea";

-- CreateTable
CREATE TABLE "Area" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameLo" TEXT NOT NULL,
    "nameZh" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Area_nameEn_key" ON "Area"("nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "Area_slug_key" ON "Area"("slug");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
