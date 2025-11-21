CREATE TABLE `collections` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isPublic` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fractals` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`imageUrl` text NOT NULL,
	`harmony` varchar(32) NOT NULL,
	`zoom` varchar(32) NOT NULL,
	`resilience` varchar(32) NOT NULL,
	`prana` varchar(32) NOT NULL,
	`drishti` varchar(32) NOT NULL,
	`klesha` varchar(32) NOT NULL,
	`isFavorite` boolean DEFAULT false,
	`isPublic` boolean DEFAULT false,
	`title` varchar(255),
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fractals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fractals_in_collections` (
	`fractalId` varchar(64) NOT NULL,
	`collectionId` varchar(64) NOT NULL,
	`addedAt` timestamp DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`userId` varchar(64) NOT NULL,
	`totalFractalsGenerated` int DEFAULT 0,
	`totalFavorites` int DEFAULT 0,
	`totalCollections` int DEFAULT 0,
	`lastGeneratedAt` timestamp,
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_stats_userId` PRIMARY KEY(`userId`)
);
