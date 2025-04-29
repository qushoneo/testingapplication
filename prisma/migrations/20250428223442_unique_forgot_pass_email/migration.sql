/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ForgotPassword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ForgotPassword_email_key" ON "ForgotPassword"("email");
