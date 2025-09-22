/*
  Warnings:

  - You are about to drop the `_TestRunTestCases` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TestCaseStatus" AS ENUM ('passed', 'failed', 'untested', 'skipped');

-- DropForeignKey
ALTER TABLE "_TestRunTestCases" DROP CONSTRAINT "_TestRunTestCases_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestRunTestCases" DROP CONSTRAINT "_TestRunTestCases_B_fkey";

-- DropTable
DROP TABLE "_TestRunTestCases";

-- CreateTable
CREATE TABLE "TestRunResult" (
    "id" SERIAL NOT NULL,
    "testRunId" INTEGER NOT NULL,
    "testCaseId" INTEGER NOT NULL,
    "status" "TestCaseStatus" NOT NULL DEFAULT 'untested',
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestRunResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestRunResult_testRunId_testCaseId_key" ON "TestRunResult"("testRunId", "testCaseId");

-- AddForeignKey
ALTER TABLE "TestRunResult" ADD CONSTRAINT "TestRunResult_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRunResult" ADD CONSTRAINT "TestRunResult_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
