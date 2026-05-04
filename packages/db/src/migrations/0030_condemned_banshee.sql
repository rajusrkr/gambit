CREATE TYPE "public"."is_account_active_enum" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."withdrawal_enabled_enum" AS ENUM('yes', 'no');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_withdrawal_on" "withdrawal_enabled_enum" DEFAULT 'yes';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_account_active" "is_account_active_enum" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "withdrawal_enabled";