/*
  Warnings:

  - You are about to drop the column `ammount` on the `charges` table. All the data in the column will be lost.
  - Added the required column `amount` to the `charges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "charges" DROP COLUMN "ammount",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;
