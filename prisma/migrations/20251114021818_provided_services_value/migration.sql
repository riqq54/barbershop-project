/*
  Warnings:

  - Added the required column `value_in_cents` to the `provided_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "provided_services" ADD COLUMN     "value_in_cents" INTEGER NOT NULL;
