DROP TABLE IF EXISTS `useraccount`;
CREATE TABLE `useraccount` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`username` varchar(100) NOT NULL DEFAULT '',
	`password` varchar(40) NOT NULL DEFAULT '',
	`expiry` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
	`skey` varchar(40) NOT NULL DEFAULT '',
	`personId` int(10) unsigned NOT NULL DEFAULT 0,
	`confirmationId` int(10) unsigned NULL DEFAULT NULL,
	`active` bool NOT NULL DEFAULT 1,
	`created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
	`createdById` int(10) unsigned NOT NULL DEFAULT 0,
	`updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updatedById` int(10) unsigned NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
	,INDEX (`personId`)
	,INDEX (`confirmationId`)
	,INDEX (`createdById`)
	,INDEX (`updatedById`)
	,INDEX (`username`)
	,INDEX (`password`)
	,INDEX (`skey`)
) ENGINE=innodb DEFAULT CHARSET=utf8;
