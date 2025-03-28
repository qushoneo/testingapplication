/*
  Warnings:

  - You are about to drop the `_TestCaseToTestPlan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TestCaseToTestPlan" DROP CONSTRAINT "_TestCaseToTestPlan_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestCaseToTestPlan" DROP CONSTRAINT "_TestCaseToTestPlan_B_fkey";

-- DropTable
DROP TABLE "_TestCaseToTestPlan";

-- CreateTable
CREATE TABLE "_TestPlanTestCases" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TestPlanTestCases_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TestPlanTestCases_B_index" ON "_TestPlanTestCases"("B");

-- AddForeignKey
ALTER TABLE "_TestPlanTestCases" ADD CONSTRAINT "_TestPlanTestCases_A_fkey" FOREIGN KEY ("A") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestPlanTestCases" ADD CONSTRAINT "_TestPlanTestCases_B_fkey" FOREIGN KEY ("B") REFERENCES "TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
