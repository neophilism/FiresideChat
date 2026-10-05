-- CreateEnum
CREATE TYPE "PersonKind" AS ENUM ('HOUSE', 'SENATE', 'PRESIDENT');

-- CreateEnum
CREATE TYPE "PodcastRole" AS ENUM ('HOST', 'COHOST', 'OFFICIAL_PRODUCER');

-- CreateEnum
CREATE TYPE "TranscriptStatus" AS ENUM ('MISSING', 'AVAILABLE', 'QUEUED', 'PROCESSING', 'COMPLETE', 'FAILED');

-- CreateEnum
CREATE TYPE "TranscriptSource" AS ENUM ('PUBLISHER', 'GENERATED');

-- CreateEnum
CREATE TYPE "IngestionRunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "PublishingStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "kind" "PersonKind" NOT NULL,
    "state" TEXT,
    "party" TEXT,
    "serviceStart" TIMESTAMP(3),
    "serviceEnd" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "portraitUrl" TEXT,
    "shortBio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rssUrl" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "publishingStatus" "PublishingStatus" NOT NULL DEFAULT 'UNKNOWN',
    "verificationUrl" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verificationNote" TEXT,
    "lastCheckedAt" TIMESTAMP(3),
    "lastEpisodeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastPerson" (
    "podcastId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "PodcastRole" NOT NULL,

    CONSTRAINT "PodcastPerson_pkey" PRIMARY KEY ("podcastId","personId","role")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER,
    "audioUrl" TEXT NOT NULL,
    "episodeUrl" TEXT,
    "transcriptStatus" "TranscriptStatus" NOT NULL DEFAULT 'MISSING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "source" "TranscriptSource" NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "fullText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptSegment" (
    "id" TEXT NOT NULL,
    "transcriptId" TEXT NOT NULL,
    "startSeconds" DOUBLE PRECISION NOT NULL,
    "endSeconds" DOUBLE PRECISION NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "TranscriptSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestionRun" (
    "id" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "status" "IngestionRunStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "IngestionRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "Person_isCurrent_idx" ON "Person"("isCurrent");

-- CreateIndex
CREATE INDEX "Person_kind_idx" ON "Person"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_slug_key" ON "Podcast"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_rssUrl_key" ON "Podcast"("rssUrl");

-- CreateIndex
CREATE INDEX "Podcast_active_idx" ON "Podcast"("active");

-- CreateIndex
CREATE INDEX "Podcast_lastEpisodeAt_idx" ON "Podcast"("lastEpisodeAt");

-- CreateIndex
CREATE INDEX "PodcastPerson_personId_idx" ON "PodcastPerson"("personId");

-- CreateIndex
CREATE INDEX "Episode_publishedAt_idx" ON "Episode"("publishedAt");

-- CreateIndex
CREATE INDEX "Episode_podcastId_publishedAt_idx" ON "Episode"("podcastId", "publishedAt");

-- CreateIndex
CREATE INDEX "Episode_transcriptStatus_idx" ON "Episode"("transcriptStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_podcastId_guid_key" ON "Episode"("podcastId", "guid");

-- CreateIndex
CREATE UNIQUE INDEX "Transcript_episodeId_key" ON "Transcript"("episodeId");

-- CreateIndex
CREATE INDEX "TranscriptSegment_transcriptId_startSeconds_idx" ON "TranscriptSegment"("transcriptId", "startSeconds");

-- CreateIndex
CREATE INDEX "IngestionRun_podcastId_startedAt_idx" ON "IngestionRun"("podcastId", "startedAt");

-- CreateIndex
CREATE INDEX "IngestionRun_status_idx" ON "IngestionRun"("status");

-- AddForeignKey
ALTER TABLE "PodcastPerson" ADD CONSTRAINT "PodcastPerson_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastPerson" ADD CONSTRAINT "PodcastPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptSegment" ADD CONSTRAINT "TranscriptSegment_transcriptId_fkey" FOREIGN KEY ("transcriptId") REFERENCES "Transcript"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngestionRun" ADD CONSTRAINT "IngestionRun_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
