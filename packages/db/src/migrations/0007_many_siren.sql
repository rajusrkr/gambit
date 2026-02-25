CREATE TABLE "outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"market_id" uuid,
	"liquidity_parameter" integer NOT NULL,
	"title" text[] NOT NULL,
	"volume" integer[] NOT NULL,
	"prices" numeric(36, 18)[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;