ALTER TABLE "money" DROP CONSTRAINT "money_payed_by_users_id_fkey";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "money" ADD COLUMN "payment_month" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "money" ADD COLUMN "payment_year" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "money" ADD COLUMN "paid_by" uuid;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age";--> statement-breakpoint
ALTER TABLE "money" DROP COLUMN "payed_month";--> statement-breakpoint
ALTER TABLE "money" DROP COLUMN "payed_by";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "photo" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "money" ADD CONSTRAINT "money_paid_by_users_id_fkey" FOREIGN KEY ("paid_by") REFERENCES "users"("id");