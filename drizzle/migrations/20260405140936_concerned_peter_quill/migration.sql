CREATE TABLE "moneys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"amount" integer NOT NULL,
	"payed_month" date NOT NULL,
	"payed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "moneys" ADD CONSTRAINT "moneys_payed_by_users_id_fkey" FOREIGN KEY ("payed_by") REFERENCES "users"("id");