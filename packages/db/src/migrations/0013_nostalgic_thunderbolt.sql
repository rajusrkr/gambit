DROP INDEX "unique_position_idx";--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "pnl" SET DATA TYPE numeric(36, 18);--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "position_taken_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "qty" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "at_total_cost" numeric(36, 18) NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "avg_price" numeric(36, 18) NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_by_user_id_fk" FOREIGN KEY ("position_taken_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_position_idx" ON "position" USING btree ("position_taken_by","position_taken_for","position_taken_in");