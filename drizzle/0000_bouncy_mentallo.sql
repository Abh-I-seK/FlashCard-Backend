CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_name` varchar(20),
	`admin_password` varchar(20),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `flashcard` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`question` varchar(50),
	`answer` varchar(50),
	`category` varchar(20),
	CONSTRAINT `flashcard_id` PRIMARY KEY(`id`)
);
