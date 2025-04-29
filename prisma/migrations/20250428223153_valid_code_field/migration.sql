/*
  Warnings:

  - Added the required column `validCode` to the `ForgotPassword` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForgotPassword" ADD COLUMN     "validCode" TEXT NOT NULL;
