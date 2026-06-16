-- Add orderType, deliveryAddress, and notes to Order table
ALTER TABLE "Order" ADD COLUMN "orderType" TEXT NOT NULL DEFAULT 'DINE_IN';
ALTER TABLE "Order" ADD COLUMN "deliveryAddress" TEXT;
ALTER TABLE "Order" ADD COLUMN "notes" TEXT;
