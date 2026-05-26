CREATE TYPE "public"."field_type" AS ENUM('short_text', 'long_text', 'email', 'number', 'date', 'single_select', 'multi_select', 'dropdown', 'rating', 'boolean');--> statement-breakpoint
CREATE TYPE "public"."form_visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"type" "field_type" NOT NULL,
	"label" varchar(200) NOT NULL,
	"label_key" varchar(200) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"display_order" varchar(50) NOT NULL,
	"options" json,
	"validations" json,
	"default_value" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "uq_form_fields_order" UNIQUE("form_id","display_order"),
	CONSTRAINT "uq_form_fields_label_key" UNIQUE("form_id","label_key")
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" text,
	"slug" varchar(120) NOT NULL,
	"created_by" uuid NOT NULL,
	"theme" varchar(50) DEFAULT 'default' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"visibility" "form_visibility" DEFAULT 'unlisted' NOT NULL,
	"success_message" text DEFAULT 'Thank you for your response!',
	"view_count" integer DEFAULT 0 NOT NULL,
	"submission_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "submission_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"profile_image_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"salt" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_answers" ADD CONSTRAINT "submission_answers_submission_id_form_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_answers" ADD CONSTRAINT "submission_answers_field_id_form_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_form_fields_form_id" ON "form_fields" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_form_id" ON "form_submissions" USING btree ("form_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_rate_limit" ON "form_submissions" USING btree ("form_id","ip_address","submitted_at");--> statement-breakpoint
CREATE INDEX "idx_forms_created_by" ON "forms" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "idx_forms_visibility_published" ON "forms" USING btree ("visibility","is_published");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_forms_slug" ON "forms" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_answers_submission_id" ON "submission_answers" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "idx_answers_field_id" ON "submission_answers" USING btree ("field_id");