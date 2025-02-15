-- CreateTable
CREATE TABLE "TestPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "TestPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TestCaseToTestPlan" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TestCaseToTestPlan_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TestCaseToTestPlan_B_index" ON "_TestCaseToTestPlan"("B");

-- AddForeignKey
ALTER TABLE "TestPlan" ADD CONSTRAINT "TestPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestCaseToTestPlan" ADD CONSTRAINT "_TestCaseToTestPlan_A_fkey" FOREIGN KEY ("A") REFERENCES "TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestCaseToTestPlan" ADD CONSTRAINT "_TestCaseToTestPlan_B_fkey" FOREIGN KEY ("B") REFERENCES "TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
