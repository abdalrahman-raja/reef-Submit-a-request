CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`identityNumber` varchar(50) NOT NULL,
	`requestNumber` varchar(50) NOT NULL,
	`inquiredAt` timestamp NOT NULL DEFAULT (now()),
	`ipAddress` varchar(45),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestNumber` varchar(50) NOT NULL,
	`identityNumber` varchar(50) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`gender` varchar(20) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`residencyNumber` varchar(50),
	`age` int,
	`nationality` varchar(100) NOT NULL,
	`requestedAmount` int NOT NULL,
	`approvedAmount` int,
	`submissionDate` timestamp NOT NULL,
	`disbursementDate` timestamp,
	`transactionNumber` varchar(50),
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `requests_requestNumber_unique` UNIQUE(`requestNumber`)
);
