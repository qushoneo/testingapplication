/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `ForgotPassword` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ForgotPassword" DROP COLUMN "expiresAt";
