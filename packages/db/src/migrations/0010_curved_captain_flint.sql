ALTER TABLE "user" ALTER COLUMN "wallet_balance" SET DATA TYPE numeric(36, 18);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "wallet_balance" SET DEFAULT '0';