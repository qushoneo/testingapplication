/*
  Warnings:

  - You are about to drop the `TestRunResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestRunResult" DROP CONSTRAINT "TestRunResult_testCaseId_fkey";

-- DropForeignKey
ALTER TABLE "TestRunResult" DROP CONSTRAINT "TestRunResult_testRunId_fkey";

-- DropTable
DROP TABLE "TestRunResult";

-- CreateTable
CREATE TABLE "TestCaseRun" (
    "id" SERIAL NOT NULL,
    "testRunId" INTEGER NOT NULL,
    "testCaseId" INTEGER NOT NULL,
    "status" "TestCaseStatus" NOT NULL DEFAULT 'untested',
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCaseRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestCaseRun_testRunId_testCaseId_key" ON "TestCaseRun"("testRunId", "testCaseId");

-- AddForeignKey
ALTER TABLE "TestCaseRun" ADD CONSTRAINT "TestCaseRun_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCaseRun" ADD CONSTRAINT "TestCaseRun_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
