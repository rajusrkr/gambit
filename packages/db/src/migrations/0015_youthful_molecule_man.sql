ALTER TABLE "market" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "created_at" SET DEFAULT now();