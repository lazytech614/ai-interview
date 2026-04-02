/*
  Warnings:

  - You are about to drop the column `creditRate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "creditRate";

-- CreateTable
CREATE TABLE "SessionRate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "SessionRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionRate_userId_duration_key" ON "SessionRate"("userId", "duration");

-- AddForeignKey
ALTER TABLE "SessionRate" ADD CONSTRAINT "SessionRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
