-- AlterTable
ALTER TABLE "Village" RENAME CONSTRAINT "Area_pkey" TO "Village_pkey";

-- RenameForeignKey
ALTER TABLE "Listing" RENAME CONSTRAINT "Listing_areaId_fkey" TO "Listing_villageId_fkey";

-- RenameIndex
ALTER INDEX "Area_nameEn_key" RENAME TO "Village_nameEn_key";

-- RenameIndex
ALTER INDEX "Area_slug_key" RENAME TO "Village_slug_key";
