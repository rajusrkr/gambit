ALTER TABLE "position" ALTER COLUMN "sell_qty" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "sell_qty" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "sell_trade_return" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "sell_trade_return" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "sell_avg_price" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "sell_avg_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "realized_pnl" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "realized_pnl" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "available_qty" integer DEFAULT 0 NOT NULL;