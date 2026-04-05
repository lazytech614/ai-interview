-- CreateEnum
CREATE TYPE "SuggestionsType" AS ENUM ('BUG', 'FEATURE', 'OTHER');

-- CreateTable
CREATE TABLE "Suggestions" (
    "id" TEXT NOT NULL,
    "type" "SuggestionsType" NOT NULL,
    "message" TEXT NOT NULL,
    "page" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suggestions_pkey" PRIMARY KEY ("id")
);
