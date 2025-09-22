-- CreateEnum
CREATE TYPE "TestRunStatus" AS ENUM ('passed', 'inProgress', 'failed', 'untested', 'skipped');

-- CreateTable
CREATE TABLE "TestRun" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "duration" INTEGER,
    "testPlanId" INTEGER NOT NULL,
    "status" "TestRunStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TestRunTestCases" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TestRunTestCases_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TestRunTestCases_B_index" ON "_TestRunTestCases"("B");

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestRun" ADD CONSTRAINT "TestRun_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestRunTestCases" ADD CONSTRAINT "_TestRunTestCases_A_fkey" FOREIGN KEY ("A") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestRunTestCases" ADD CONSTRAINT "_TestRunTestCases_B_fkey" FOREIGN KEY ("B") REFERENCES "TestRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
