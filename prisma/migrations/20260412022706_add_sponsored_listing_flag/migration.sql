-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "sponsored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sponsoredUntil" TIMESTAMP(3);
