CREATE TABLE "discussionRoom" (
	"id" uuid PRIMARY KEY NOT NULL,
	"market_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"discussion_ref" uuid NOT NULL,
	"message" text NOT NULL,
	"message_by" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "discussionRoom" ADD CONSTRAINT "discussionRoom_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_discussion_ref_discussionRoom_id_fk" FOREIGN KEY ("discussion_ref") REFERENCES "public"."discussionRoom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_message_by_user_id_fk" FOREIGN KEY ("message_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;