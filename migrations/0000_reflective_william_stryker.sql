DO $$ BEGIN
 CREATE TYPE "category_enum" AS ENUM('concert', 'conference', 'game');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"date" date NOT NULL,
	"available_attendees_count" smallint NOT NULL,
	"description" varchar(500) NOT NULL,
	"category_enum" "category_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reservations" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"event_id" varchar NOT NULL,
	"attendees_count" smallint NOT NULL,
	"reserved_at" timestamp DEFAULT now(),
	CONSTRAINT "user_reservation_per_event" UNIQUE("user_id","event_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "users" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reservations" ADD CONSTRAINT "reservations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
