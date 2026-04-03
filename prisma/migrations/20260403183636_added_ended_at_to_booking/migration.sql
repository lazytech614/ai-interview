-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PROCESSING';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "endedAt" TIMESTAMP(3);
