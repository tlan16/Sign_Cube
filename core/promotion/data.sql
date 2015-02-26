INSERT INTO `person` (`id`, `email`, `firstName`, `lastName`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES 
	(1,'', '', 'User', 1, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42),
	(10,'test@test.com', 'Test', 'User', 0, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42),
	(42,'System acc', 'System', 'User', 1, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42);

INSERT INTO `useraccount` (`id`, `username`, `password`, `personId`,  `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES 
	(1,'Guest Only','no working', 1, 1, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42),
	(10,'test@test.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 10, 0, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42),
	(42,'System acc','system acc, no login', 1, '2014-03-06 19:47:35', 42, 42, '2014-03-25 06:45:56', 42);
	
INSERT INTO `role` (`id`, `name`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES 
	(40,'tenant', 1, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42),
	(41,'agent', 1, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42),
	(42,'owner', 1, '2014-03-06 19:47:35', 42, '2014-03-25 06:45:56', 42);
	
UPDATE `signcube`.`useraccount` SET `active` = '1' WHERE `useraccount`.`id` = 10;

-- phpMyAdmin SQL Dump
-- version 4.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 26, 2015 at 11:25 AM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `signcube`
--

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

DROP TABLE IF EXISTS `systemsettings`;
CREATE TABLE IF NOT EXISTS `systemsettings` (
  `id` int(10) unsigned NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(100) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `systemsettings`
--

INSERT INTO `systemsettings` (`id`, `type`, `value`, `description`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'asset_root', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video', '', 1, '0001-01-01 00:00:00', 0, '2015-02-26 10:10:52', 0),
(2, 'system_timezone', 'Australia/Melbourne', 'The timezone this CURRENT SYSTEM is operating on', 1, '2014-03-06 19:47:35', 10, '2015-02-26 10:24:15', 10),
(3, 'sending_server_conf', '{"host":"smtp.gmail.com","port":"587","SMTPAuth":true,"username":"signcubeau@gmail.com","password":"signcube1","SMTPSecure":"tls","SMTPDebug":2,"debugOutput":"html"}', 'SMTP sending server conf', 1, '2014-12-20 13:11:57', 10, '2015-02-26 10:24:18', 10),
(4, 'sys_email_addr', 'noreply@budgetpc.com.au', 'system default email address', 1, '2014-12-21 14:16:01', 10, '2015-02-26 10:24:20', 10);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `type` (`type`), ADD KEY `createdById` (`createdById`), ADD KEY `updatedById` (`updatedById`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `systemsettings`
--
ALTER TABLE `systemsettings`
  MODIFY `id` int(10) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
