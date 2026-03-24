ALTER TABLE "position" ALTER COLUMN "position_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."position_status";--> statement-breakpoint
CREATE TYPE "public"."position_status" AS ENUM('open', 'settled');--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "position_status" SET DATA TYPE "public"."position_status" USING "position_status"::"public"."position_status";