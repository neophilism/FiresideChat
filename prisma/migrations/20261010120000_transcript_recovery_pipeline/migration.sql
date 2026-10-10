ALTER TABLE "Episode"
  ADD COLUMN "publisherTranscriptAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "publisherTranscriptLastAttemptAt" TIMESTAMP(3),
  ADD COLUMN "publisherTranscriptLastError" TEXT,
  ADD COLUMN "transcriptDiscoveryAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "transcriptDiscoveryLastAttemptAt" TIMESTAMP(3),
  ADD COLUMN "transcriptDiscoveryLastError" TEXT;

CREATE INDEX "Episode_transcript_recovery_idx" ON "Episode"("transcriptStatus", "publisherTranscriptAttempts", "transcriptDiscoveryAttempts");
