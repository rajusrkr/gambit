ALTER TABLE "admin_request" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "admin_request" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "admin_request" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;