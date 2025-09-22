-- AlterTable
ALTER TABLE "TestRun" ALTER COLUMN "testPlanId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_TestRunTestCases" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TestRunTestCases_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TestRunTestCases_B_index" ON "_TestRunTestCases"("B");

-- AddForeignKey
ALTER TABLE "_TestRunTestCases" ADD CONSTRAINT "_TestRunTestCases_A_fkey" FOREIGN KEY ("A") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestRunTestCases" ADD CONSTRAINT "_TestRunTestCases_B_fkey" FOREIGN KEY ("B") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
