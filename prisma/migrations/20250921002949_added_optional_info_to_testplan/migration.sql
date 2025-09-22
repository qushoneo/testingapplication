-- CreateTable
CREATE TABLE "OptionalTestRunInfo" (
    "id" SERIAL NOT NULL,
    "environment" TEXT,
    "os" TEXT,
    "screenSize" TEXT,
    "testRunId" INTEGER NOT NULL,

    CONSTRAINT "OptionalTestRunInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OptionalTestRunInfo_testRunId_key" ON "OptionalTestRunInfo"("testRunId");

-- AddForeignKey
ALTER TABLE "OptionalTestRunInfo" ADD CONSTRAINT "OptionalTestRunInfo_testRunId_fkey" FOREIGN KEY ("testRunId") REFERENCES "TestRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
