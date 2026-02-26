CREATE TYPE "public"."reason_types" AS ENUM('trade:buy', 'trade:sell', 'deposit', 'withdrawal', 'charge');--> statement-breakpoint
CREATE TYPE "public"."transaction_types" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TABLE "user_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_type" "transaction_types" NOT NULL,
	"reason" "reason_types" NOT NULL,
	"details" text NOT NULL,
	"amount" numeric(36, 18) NOT NULL,
	"new_balance" numeric(36, 18) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
