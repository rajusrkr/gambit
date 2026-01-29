CREATE TYPE "public"."admin_request_status" AS ENUM('rejected', 'approved');--> statement-breakpoint
CREATE TYPE "public"."market_category" AS ENUM('sports', 'crypto', 'weather');--> statement-breakpoint
CREATE TYPE "public"."market_status" AS ENUM('open', 'settled', 'resolving', 'open_soon');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('buy', 'sell');--> statement-breakpoint
CREATE TYPE "public"."position_status" AS ENUM('open', 'partially_open', 'settled');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"username" text,
	"display_username" text,
	"role" text DEFAULT 'admin' NOT NULL,
	"is_full_name_visible" boolean DEFAULT true,
	"is_user_name_visible" boolean DEFAULT true,
	"permissions" jsonb,
	CONSTRAINT "admin_email_unique" UNIQUE("email"),
	CONSTRAINT "admin_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "admin_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "admin_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "admin_two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "admin_request_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "crypto_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interval" text NOT NULL,
	"crypto_name" text NOT NULL,
	"market_id" uuid
);
--> statement-breakpoint
CREATE TABLE "market" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"settlement_rules" text NOT NULL,
	"category" "market_category" NOT NULL,
	"outcomes" jsonb NOT NULL,
	"winner" text,
	"status" "market_status" DEFAULT 'open_soon' NOT NULL,
	"market_starts" bigint NOT NULL,
	"market_ends" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "market_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sports_category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" text NOT NULL,
	"market_id" uuid
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_taken_in" uuid NOT NULL,
	"order_placed_for" text NOT NULL,
	"order_type" "order_type" NOT NULL,
	"qty" integer NOT NULL,
	"average_traded_price" bigint,
	"updated_prices" jsonb NOT NULL,
	"order_status" "order_status" NOT NULL,
	"order_failure_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position_taken_in" uuid NOT NULL,
	"position_taken_for" text NOT NULL,
	"total_qty_and_avg_price" jsonb NOT NULL,
	"pnl" bigint,
	"position_status" "position_status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"two_factor_enabled" boolean DEFAULT false,
	"username" text,
	"display_username" text,
	"is_full_name_visible" boolean DEFAULT true NOT NULL,
	"is_username_visible" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_account" ADD CONSTRAINT "admin_account_user_id_admin_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_user_id_admin_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_two_factor" ADD CONSTRAINT "admin_two_factor_user_id_admin_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crypto_category" ADD CONSTRAINT "crypto_category_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sports_category" ADD CONSTRAINT "sports_category_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_taken_in_market_id_fk" FOREIGN KEY ("order_taken_in") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_in_market_id_fk" FOREIGN KEY ("position_taken_in") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adminAccount_userId_idx" ON "admin_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "adminSession_userId_idx" ON "admin_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "adminTwoFactor_secret_idx" ON "admin_two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "adminTwoFactor_userId_idx" ON "admin_two_factor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "adminVerification_identifier_idx" ON "admin_verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "twoFactor_secret_idx" ON "two_factor" USING btree ("secret");--> statement-breakpoint
CREATE INDEX "twoFactor_userId_idx" ON "two_factor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");