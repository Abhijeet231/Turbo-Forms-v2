ALTER TABLE "users" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "salt";