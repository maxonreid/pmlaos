-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_listingId_fkey";

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
