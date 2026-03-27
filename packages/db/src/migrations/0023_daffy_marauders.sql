ALTER TABLE "position" RENAME COLUMN "qty" TO "buy_qty";--> statement-breakpoint
ALTER TABLE "position" RENAME COLUMN "at_total_cost" TO "buy_trade_cost";--> statement-breakpoint
ALTER TABLE "position" RENAME COLUMN "avg_price" TO "buy_avg_price";--> statement-breakpoint
ALTER TABLE "position" RENAME COLUMN "pnl" TO "realized_pnl";