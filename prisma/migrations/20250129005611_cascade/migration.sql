-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_folderId_fkey";

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
