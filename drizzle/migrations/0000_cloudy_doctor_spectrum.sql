CREATE TABLE `chat_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text,
	`course_id` text,
	`lti_launch_id` text,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`lti_iss` text,
	`created_at` integer DEFAULT (unixepoch())
);
--> statement-breakpoint
CREATE TABLE `document_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text,
	`chunk_index` integer,
	`chunk_text` text NOT NULL,
	`page_number` integer,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text,
	`name` text NOT NULL,
	`source_url` text,
	`page_count` integer,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text,
	`triggered_at_msg` integer,
	`radar_scores` text,
	`strengths` text,
	`gaps` text,
	`overall_score` real,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`citations` text,
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`lti_iss` text NOT NULL,
	`display_name` text,
	`email` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch())
);
