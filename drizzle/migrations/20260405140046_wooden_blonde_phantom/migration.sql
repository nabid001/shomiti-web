CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" text NOT NULL,
	"username" text NOT NULL UNIQUE,
	"age" integer NOT NULL,
	"gender" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"photo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
