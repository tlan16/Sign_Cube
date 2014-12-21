# new word table
DROP TABLE IF EXISTS `word`;
CREATE TABLE `word` (
	`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	`name` varchar(32) NOT NULL DEFAULT '',
	`video` varchar(128) NOT NULL DEFAULT '',
	`active` bool NOT NULL DEFAULT 1,
	`created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
	`createdById` int(10) unsigned NOT NULL DEFAULT 0,
	`updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`updatedById` int(10) unsigned NOT NULL DEFAULT 0,
	PRIMARY KEY (`id`)
	,INDEX (`createdById`)
	,INDEX (`updatedById`)
	,INDEX (`name`)
	,INDEX (`video`)
) ENGINE=innodb DEFAULT CHARSET=utf8;