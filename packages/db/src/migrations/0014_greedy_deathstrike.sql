ALTER TABLE "order" ALTER COLUMN "average_traded_price" SET DATA TYPE numeric(36, 18);--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "updated_prices" DROP NOT NULL;