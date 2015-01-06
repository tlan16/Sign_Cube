-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2015 at 10:46 AM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET FOREIGN_KEY_CHECKS=0;
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
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sKey` varchar(32) NOT NULL DEFAULT '',
  `street` varchar(100) NOT NULL DEFAULT '',
  `city` varchar(20) NOT NULL DEFAULT '',
  `region` varchar(20) NOT NULL DEFAULT '',
  `country` varchar(20) NOT NULL DEFAULT '',
  `postCode` varchar(10) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `sKey` (`sKey`),
  KEY `city` (`city`),
  KEY `region` (`region`),
  KEY `country` (`country`),
  KEY `postCode` (`postCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
CREATE TABLE IF NOT EXISTS `asset` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `assetId` varchar(32) NOT NULL DEFAULT '',
  `filename` varchar(100) NOT NULL DEFAULT '',
  `mimeType` varchar(50) NOT NULL DEFAULT '',
  `path` varchar(200) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `assetId` (`assetId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `asset`
--

INSERT INTO `asset` (`id`, `assetId`, `filename`, `mimeType`, `path`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'd67e099d6fd1c3aa80e75c3bc1079b27', '65850_1.mp4', 'video/mp4', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video\\2015\\01\\d67e099d6fd1c3aa80e75c3bc1079b27', 1, '2015-01-02 14:45:45', 42, '2015-01-02 03:45:45', 42),
(2, '365a06b971d39948a30ddc216651fe33', '66290.mp4', 'video/mp4', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video\\2015\\01\\365a06b971d39948a30ddc216651fe33', 1, '2015-01-02 14:45:45', 42, '2015-01-02 03:45:45', 42),
(3, 'cd3bbac10819546044382173e0bd4f1a', '39190.mp4', 'video/mp4', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video\\2015\\01\\cd3bbac10819546044382173e0bd4f1a', 1, '2015-01-02 14:45:49', 42, '2015-01-02 03:45:49', 42),
(4, '38019f94b11645ae4d1f4690fd788bfe', '39190.mp4', 'video/mp4', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video\\2015\\01\\38019f94b11645ae4d1f4690fd788bfe', 1, '2015-01-02 14:45:52', 42, '2015-01-02 03:45:52', 42),
(5, 'aa97ab391d18a9fe6602a55615b54b1c', '34820.mp4', 'video/mp4', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video\\2015\\01\\aa97ab391d18a9fe6602a55615b54b1c', 1, '2015-01-02 14:45:56', 42, '2015-01-02 03:45:56', 42),
(6, 'f295134725943aaaf043542bba0071f2', '14550.mp4', 'video/mp4', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video\\2015\\01\\f295134725943aaaf043542bba0071f2', 1, '2015-01-02 14:46:00', 42, '2015-01-02 03:46:00', 42);

-- --------------------------------------------------------

--
-- Table structure for table `auslanvideo`
--

DROP TABLE IF EXISTS `auslanvideo`;
CREATE TABLE IF NOT EXISTS `auslanvideo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `media` varchar(255) NOT NULL DEFAULT '',
  `poster` varchar(255) NOT NULL DEFAULT '',
  `assetId` varchar(255) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `auslanvideo`
--

INSERT INTO `auslanvideo` (`id`, `media`, `poster`, `assetId`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'http://media.auslan.org.au/mp4video/65/65850_1.mp4', 'http://media.auslan.org.au/mp4video/65/65850_1.jpg', '1', 1, '2015-01-02 14:45:45', 42, '2015-01-02 03:45:45', 42),
(2, 'http://media.auslan.org.au/auslan/66/66290.mp4', 'http://media.auslan.org.au/auslan/66/66290.jpg', '2', 1, '2015-01-02 14:45:45', 42, '2015-01-02 03:45:45', 42),
(3, 'http://media.auslan.org.au/auslan/39/39190.mp4', 'http://media.auslan.org.au/auslan/39/39190.jpg', '4', 1, '2015-01-02 14:45:49', 42, '2015-01-02 03:45:52', 42),
(4, 'http://media.auslan.org.au/auslan/34/34820.mp4', 'http://media.auslan.org.au/auslan/34/34820.jpg', '5', 1, '2015-01-02 14:45:56', 42, '2015-01-02 03:45:56', 42),
(5, 'http://media.auslan.org.au/auslan/14/14550.mp4', 'http://media.auslan.org.au/auslan/14/14550.jpg', '6', 1, '2015-01-02 14:46:00', 42, '2015-01-02 03:46:00', 42);

-- --------------------------------------------------------

--
-- Table structure for table `auslanword`
--

DROP TABLE IF EXISTS `auslanword`;
CREATE TABLE IF NOT EXISTS `auslanword` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `href` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `auslanword`
--

INSERT INTO `auslanword` (`id`, `name`, `href`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'abattoir', 'http://www.auslan.org.au/dictionary/words/abattoir-1.html', 1, '2015-01-02 14:45:44', 42, '2015-01-02 03:45:44', 42),
(2, 'abbreviate', 'http://www.auslan.org.au/dictionary/words/abbreviate-1.html', 1, '2015-01-02 14:45:47', 42, '2015-01-02 03:45:47', 42),
(3, 'abbreviation', 'http://www.auslan.org.au/dictionary/words/abbreviation-1.html', 1, '2015-01-02 14:45:51', 42, '2015-01-02 03:45:51', 42),
(4, 'abdomen', 'http://www.auslan.org.au/dictionary/words/abdomen-1.html', 1, '2015-01-02 14:45:54', 42, '2015-01-02 03:45:54', 42),
(5, 'abide', 'http://www.auslan.org.au/dictionary/words/abide-1.html', 1, '2015-01-02 14:45:58', 42, '2015-01-02 03:45:58', 42),
(6, 'able', 'http://www.auslan.org.au/dictionary/words/able-1.html', 1, '2015-01-02 14:46:02', 42, '2015-01-02 03:46:02', 42);

-- --------------------------------------------------------

--
-- Table structure for table `auslanwordrel`
--

DROP TABLE IF EXISTS `auslanwordrel`;
CREATE TABLE IF NOT EXISTS `auslanwordrel` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `wordId` int(10) unsigned NOT NULL DEFAULT '0',
  `videoId` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `wordId` (`wordId`),
  KEY `videoId` (`videoId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `auslanwordrel`
--

INSERT INTO `auslanwordrel` (`id`, `wordId`, `videoId`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 1, 1, 1, '2015-01-02 14:45:45', 42, '2015-01-02 03:45:45', 42),
(2, 1, 2, 1, '2015-01-02 14:45:45', 42, '2015-01-02 03:45:45', 42),
(3, 2, 3, 1, '2015-01-02 14:45:49', 42, '2015-01-02 03:45:49', 42),
(4, 3, 3, 1, '2015-01-02 14:45:52', 42, '2015-01-02 03:45:52', 42),
(5, 4, 4, 1, '2015-01-02 14:45:56', 42, '2015-01-02 03:45:56', 42),
(6, 5, 5, 1, '2015-01-02 14:46:00', 42, '2015-01-02 03:46:00', 42);

-- --------------------------------------------------------

--
-- Table structure for table `confirmation`
--

DROP TABLE IF EXISTS `confirmation`;
CREATE TABLE IF NOT EXISTS `confirmation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sKey` varchar(32) NOT NULL DEFAULT '',
  `type` varchar(20) NOT NULL DEFAULT '',
  `entityId` int(10) unsigned NOT NULL DEFAULT '0',
  `entityName` varchar(100) NOT NULL DEFAULT '',
  `comments` varchar(255) NOT NULL DEFAULT '',
  `expiryTime` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `sKey` (`sKey`),
  KEY `entityId` (`entityId`),
  KEY `entityName` (`entityName`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `definition`
--

DROP TABLE IF EXISTS `definition`;
CREATE TABLE IF NOT EXISTS `definition` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `explanation`
--

DROP TABLE IF EXISTS `explanation`;
CREATE TABLE IF NOT EXISTS `explanation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
CREATE TABLE IF NOT EXISTS `log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `transId` varchar(32) NOT NULL DEFAULT '',
  `type` varchar(20) NOT NULL DEFAULT '',
  `entityId` int(10) unsigned NOT NULL DEFAULT '0',
  `entityName` varchar(100) NOT NULL DEFAULT '',
  `funcName` varchar(100) NOT NULL DEFAULT '',
  `comments` varchar(255) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `transId` (`transId`),
  KEY `entityId` (`entityId`),
  KEY `entityName` (`entityName`),
  KEY `type` (`type`),
  KEY `funcName` (`funcName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `sendType` varchar(10) NOT NULL DEFAULT '',
  `toId` int(10) unsigned NOT NULL DEFAULT '0',
  `fromId` int(10) unsigned NOT NULL DEFAULT '0',
  `type` varchar(10) NOT NULL DEFAULT '',
  `subject` varchar(100) NOT NULL DEFAULT '',
  `body` longtext NOT NULL,
  `transId` varchar(32) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `toId` (`toId`),
  KEY `fromId` (`fromId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `isRead` (`isRead`),
  KEY `sendType` (`sendType`),
  KEY `transId` (`transId`),
  KEY `type` (`type`),
  KEY `subject` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
CREATE TABLE IF NOT EXISTS `person` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL DEFAULT '',
  `firstName` varchar(50) NOT NULL DEFAULT '',
  `lastName` varchar(50) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `email` (`email`),
  KEY `firstName` (`firstName`),
  KEY `lastName` (`lastName`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=43 ;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `email`, `firstName`, `lastName`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, '', '', 'User', 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42),
(10, 'test@test.com', 'Test', 'User', 0, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42),
(42, 'System acc', 'System', 'User', 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42);

-- --------------------------------------------------------

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
CREATE TABLE IF NOT EXISTS `property` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sKey` varchar(32) NOT NULL DEFAULT '',
  `description` text NOT NULL,
  `addressId` int(10) unsigned DEFAULT NULL,
  `noOfRooms` int(10) unsigned NOT NULL DEFAULT '0',
  `noOfCars` int(10) unsigned NOT NULL DEFAULT '0',
  `noOfBaths` int(10) unsigned NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `addressId` (`addressId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `sKey` (`sKey`),
  KEY `noOfRooms` (`noOfRooms`),
  KEY `noOfCars` (`noOfCars`),
  KEY `noOfBaths` (`noOfBaths`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `propertyrel`
--

DROP TABLE IF EXISTS `propertyrel`;
CREATE TABLE IF NOT EXISTS `propertyrel` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `propertyId` int(10) unsigned NOT NULL DEFAULT '0',
  `roleId` int(10) unsigned NOT NULL DEFAULT '0',
  `personId` int(10) unsigned NOT NULL DEFAULT '0',
  `confirmationId` int(10) unsigned DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  KEY `roleId` (`roleId`),
  KEY `personId` (`personId`),
  KEY `confirmationId` (`confirmationId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=43 ;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(40, 'tenant', 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42),
(41, 'agent', 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42),
(42, 'owner', 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE IF NOT EXISTS `session` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(32) NOT NULL DEFAULT '',
  `data` longtext NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `key`, `data`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'g6hrjjc2lrpt3qkh30u49qbnd2', 'AuthExpireTime|i:1420214330;BMV-Lib-System:ReturnUrl|s:22:"/backend/3rdparty.html";e8df32c61df3858507661a22d785798e|s:129:"a:2:{i:0;s:43:"a:2:{s:6:"userId";s:2:"10";s:6:"roleId";N;}";i:1;s:56:"a:2:{s:4:"Name";s:13:"test@test.com";s:7:"IsGuest";b:0;}";}";', 1, '2015-01-02 14:46:07', 1, '2015-01-02 03:58:50', 1),
(2, '5skkvldl8n7kd0pvmsrdng9944', 'AuthExpireTime|i:1420368907;e8df32c61df3858507661a22d785798e|s:129:"a:2:{i:0;s:43:"a:2:{s:6:"userId";s:2:"10";s:6:"roleId";N;}";i:1;s:56:"a:2:{s:4:"Name";s:13:"test@test.com";s:7:"IsGuest";b:0;}";}";', 1, '2015-01-04 09:48:58', 1, '2015-01-03 22:55:07', 1),
(5, '17l2qp9kfg5j1u5l0hq554lhj1', 'AuthExpireTime|i:1420506972;', 1, '2015-01-06 00:03:07', 1, '2015-01-05 13:16:13', 1),
(6, 'npu6s8qsa0o8413nr973bo9095', 'AuthExpireTime|i:1420540401;e8df32c61df3858507661a22d785798e|s:129:"a:2:{i:0;s:43:"a:2:{s:6:"userId";s:2:"10";s:6:"roleId";N;}";i:1;s:56:"a:2:{s:4:"Name";s:13:"test@test.com";s:7:"IsGuest";b:0;}";}";', 1, '2015-01-06 09:24:15', 1, '2015-01-05 22:33:21', 1);

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

DROP TABLE IF EXISTS `systemsettings`;
CREATE TABLE IF NOT EXISTS `systemsettings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(100) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `systemsettings`
--

INSERT INTO `systemsettings` (`id`, `type`, `value`, `description`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'asset_root', 'C:\\Users\\Frank-Desktop\\git\\Sign_Cube\\web\\assets\\video', '', 1, '0001-01-01 00:00:00', 0, '2015-01-02 14:45:29', 0);

-- --------------------------------------------------------

--
-- Table structure for table `useraccount`
--

DROP TABLE IF EXISTS `useraccount`;
CREATE TABLE IF NOT EXISTS `useraccount` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL DEFAULT '',
  `password` varchar(40) NOT NULL DEFAULT '',
  `personId` int(10) unsigned NOT NULL DEFAULT '0',
  `confirmationId` int(10) unsigned DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `personId` (`personId`),
  KEY `confirmationId` (`confirmationId`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `username` (`username`),
  KEY `password` (`password`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=43 ;

--
-- Dumping data for table `useraccount`
--

INSERT INTO `useraccount` (`id`, `username`, `password`, `personId`, `confirmationId`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'Guest Only', 'no working', 1, NULL, 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42),
(10, 'test@test.com', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 10, NULL, 1, '2014-03-06 19:47:35', 42, '2014-03-24 19:45:56', 42),
(42, 'System acc', 'system acc, no login', 1, NULL, 127, '0000-00-00 00:00:00', 42, '2014-03-24 19:45:56', 42);

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

DROP TABLE IF EXISTS `video`;
CREATE TABLE IF NOT EXISTS `video` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `word`
--

DROP TABLE IF EXISTS `word`;
CREATE TABLE IF NOT EXISTS `word` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `wordvideo`
--

DROP TABLE IF EXISTS `wordvideo`;
CREATE TABLE IF NOT EXISTS `wordvideo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `wordid` varchar(32) NOT NULL DEFAULT '',
  `videoid` varchar(32) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT '0001-01-01 00:00:00',
  `createdById` int(10) unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatedById` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `createdById` (`createdById`),
  KEY `updatedById` (`updatedById`),
  KEY `wordid` (`wordid`),
  KEY `videoid` (`videoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
SET FOREIGN_KEY_CHECKS=1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
