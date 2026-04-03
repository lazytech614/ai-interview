/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,type]` on the table `CreditTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreditTransaction_bookingId_type_key" ON "CreditTransaction"("bookingId", "type");
