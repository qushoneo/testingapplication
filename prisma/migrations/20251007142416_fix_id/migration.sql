/*
  Warnings:

  - You are about to drop the column `testRunId` on the `Defect` table. All the data in the column will be lost.
  - Added the required column `testCaseRunId` to the `Defect` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Defect" DROP CONSTRAINT "Defect_testRunId_fkey";

-- AlterTable
ALTER TABLE "Defect" DROP COLUMN "testRunId",
ADD COLUMN     "testCaseRunId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_testCaseRunId_fkey" FOREIGN KEY ("testCaseRunId") REFERENCES "TestCaseRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
