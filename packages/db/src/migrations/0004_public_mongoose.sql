ALTER TABLE "market" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "status" SET DEFAULT 'open_soon'::text;--> statement-breakpoint
DROP TYPE "public"."market_status";--> statement-breakpoint
CREATE TYPE "public"."market_status" AS ENUM('open', 'settled', 'new_order_paused', 'open_soon', 'canceled');--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "status" SET DEFAULT 'open_soon'::"public"."market_status";--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "status" SET DATA TYPE "public"."market_status" USING "status"::"public"."market_status";--> statement-breakpoint
ALTER TABLE "sports_category" ADD COLUMN "match" text NOT NULL;--> statement-breakpoint
ALTER TABLE "sports_category" ADD COLUMN "match_starts" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "sports_category" ADD COLUMN "match_ends" bigint NOT NULL;