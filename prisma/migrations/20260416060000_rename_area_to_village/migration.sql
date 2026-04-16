-- Rename Area table to Village
ALTER TABLE "Area" RENAME TO "Village";

-- Rename areaId to villageId in Listing
ALTER TABLE "Listing" RENAME COLUMN "areaId" TO "villageId";

-- Drop redundant location text columns (were copies of village.nameEn)
ALTER TABLE "Listing" DROP COLUMN "locationEn";
ALTER TABLE "Listing" DROP COLUMN "locationLo";
ALTER TABLE "Listing" DROP COLUMN "locationZh";
