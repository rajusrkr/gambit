ALTER TABLE "position" ADD COLUMN "sell_qty" integer;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "sell_trade_return" numeric(36, 18);--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "sell_avg_price" numeric(36, 18);