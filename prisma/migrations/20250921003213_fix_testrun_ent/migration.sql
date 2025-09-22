/*
  Warnings:

  - You are about to drop the column `duration` on the `TestRun` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TestRun" DROP COLUMN "duration",
ALTER COLUMN "status" SET DEFAULT 'inProgress';
