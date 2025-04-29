/*
  Warnings:

  - You are about to drop the column `email` on the `ForgotPassword` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `ForgotPassword` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `ForgotPassword` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ForgotPassword` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ForgotPassword" DROP CONSTRAINT "ForgotPassword_email_fkey";

-- DropIndex
DROP INDEX "ForgotPassword_email_key";

-- AlterTable
ALTER TABLE "ForgotPassword" DROP COLUMN "email",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_userId_key" ON "ForgotPassword"("userId");

-- AddForeignKey
ALTER TABLE "ForgotPassword" ADD CONSTRAINT "ForgotPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
