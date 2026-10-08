ALTER TABLE "Episode"
ADD COLUMN "transcriptionAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "transcriptionLastAttemptAt" TIMESTAMP(3),
ADD COLUMN "transcriptionLastError" TEXT;
