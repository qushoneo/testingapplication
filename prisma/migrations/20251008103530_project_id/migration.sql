/*
  Warnings:

  - Added the required column `projectId` to the `Defect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Defect" ADD COLUMN     "projectId" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DefectComment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "defectId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefectComment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Defect" ADD CONSTRAINT "Defect_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefectComment" ADD CONSTRAINT "DefectComment_defectId_fkey" FOREIGN KEY ("defectId") REFERENCES "Defect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefectComment" ADD CONSTRAINT "DefectComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
