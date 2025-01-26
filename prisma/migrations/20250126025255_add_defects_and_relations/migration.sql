/*
  Warnings:

  - The values [CRITICAL] on the enum `Severity` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Severity_new" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
ALTER TABLE "Defect" ALTER COLUMN "severity" TYPE "Severity_new" USING ("severity"::text::"Severity_new");
ALTER TYPE "Severity" RENAME TO "Severity_old";
ALTER TYPE "Severity_new" RENAME TO "Severity";
DROP TYPE "Severity_old";
COMMIT;
