ALTER TABLE "admin_request" ADD COLUMN "reques_by" text;--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "order_placed_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "position_taken_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_request" ADD CONSTRAINT "admin_request_reques_by_admin_id_fk" FOREIGN KEY ("reques_by") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_placed_by_user_id_fk" FOREIGN KEY ("order_placed_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_by_user_id_fk" FOREIGN KEY ("position_taken_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;