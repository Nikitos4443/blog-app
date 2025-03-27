/*
  Warnings:

  - Added the required column `isLiked` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "Comments" TEXT[],
ADD COLUMN     "isLiked" BOOLEAN NOT NULL;
