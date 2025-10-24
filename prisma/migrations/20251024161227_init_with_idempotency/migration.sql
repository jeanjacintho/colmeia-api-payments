-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'PIX', 'BOLETO');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "status" "ChargeStatus" NOT NULL DEFAULT 'PENDING',
    "customerId" TEXT NOT NULL,
    "chargeHash" TEXT NOT NULL,
    "pixData" JSONB,
    "cardData" JSONB,
    "boletoData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_document_key" ON "customers"("document");

-- CreateIndex
CREATE UNIQUE INDEX "charges_chargeHash_key" ON "charges"("chargeHash");

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
