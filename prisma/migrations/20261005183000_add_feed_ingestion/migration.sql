-- AlterTable
ALTER TABLE "Podcast"
ADD COLUMN "feedTitle" TEXT,
ADD COLUMN "feedDescription" TEXT,
ADD COLUMN "feedWebsiteUrl" TEXT,
ADD COLUMN "feedImageUrl" TEXT,
ADD COLUMN "language" TEXT,
ADD COLUMN "feedEtag" TEXT,
ADD COLUMN "feedLastModified" TEXT,
ADD COLUMN "lastSuccessfulCheckAt" TIMESTAMP(3),
ADD COLUMN "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "nextRetryAt" TIMESTAMP(3),
ADD COLUMN "lastError" TEXT;

-- AlterTable
ALTER TABLE "Episode"
ADD COLUMN "sourceUpdatedAt" TIMESTAMP(3),
ADD COLUMN "audioMimeType" TEXT,
ADD COLUMN "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "IngestionRun"
ADD COLUMN "httpStatus" INTEGER,
ADD COLUMN "notModified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "feedBytes" INTEGER,
ADD COLUMN "episodesSeen" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "episodesCreated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "episodesUpdated" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "episodesSkipped" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Podcast_nextRetryAt_idx" ON "Podcast"("nextRetryAt");
