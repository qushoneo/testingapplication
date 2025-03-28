/*
  Warnings:

  - Added the required column `description` to the `TestPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestPlan" ADD COLUMN     "description" TEXT NOT NULL;
