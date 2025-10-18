/*
  Warnings:

  - You are about to drop the column `value_in_cents` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "value_in_cents";

-- CreateTable
CREATE TABLE "service_prices" (
    "id" TEXT NOT NULL,
    "value_in_cents" INTEGER NOT NULL,
    "serviceId" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
