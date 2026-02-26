ALTER TABLE "position" DROP CONSTRAINT "position_position_taken_by_user_id_fk";
--> statement-breakpoint
DROP INDEX "unique_position_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_position_idx" ON "position" USING btree ("position_taken_for","position_taken_in");--> statement-breakpoint
ALTER TABLE "position" DROP COLUMN "position_taken_by";