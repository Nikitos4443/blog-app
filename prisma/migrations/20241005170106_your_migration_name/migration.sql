-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL DEFAULT 'default',
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';
