CREATE TYPE "InquiryEmailStatus" AS ENUM ('PENDING', 'SENDING', 'SENT', 'FAILED');

CREATE TABLE "PodcastProductionInquiry" (
  "id" TEXT NOT NULL,
  "memberName" TEXT NOT NULL,
  "chamber" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "district" TEXT,
  "officeKey" TEXT NOT NULL,
  "contactEmailHash" TEXT NOT NULL,
  "clientHash" TEXT NOT NULL,
  "protectedDetails" TEXT NOT NULL,
  "emailStatus" "InquiryEmailStatus" NOT NULL DEFAULT 'PENDING',
  "emailSentAt" TIMESTAMP(3),
  "emailAttempts" INTEGER NOT NULL DEFAULT 0,
  "emailLastAttemptAt" TIMESTAMP(3),
  "emailLastError" TEXT,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "PodcastProductionInquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PodcastProductionInquiry_officeKey_submittedAt_idx" ON "PodcastProductionInquiry"("officeKey", "submittedAt");
CREATE INDEX "PodcastProductionInquiry_clientHash_submittedAt_idx" ON "PodcastProductionInquiry"("clientHash", "submittedAt");
CREATE INDEX "PodcastProductionInquiry_contactEmailHash_submittedAt_idx" ON "PodcastProductionInquiry"("contactEmailHash", "submittedAt");
CREATE INDEX "PodcastProductionInquiry_emailStatus_emailLastAttemptAt_idx" ON "PodcastProductionInquiry"("emailStatus", "emailLastAttemptAt");
