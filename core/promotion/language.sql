-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 29, 2015 at 01:54 AM
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

--
-- Dumping data for table `language`
--

INSERT INTO `language` (`id`, `name`, `code`, `active`, `created`, `createdById`, `updated`, `updatedById`) VALUES
(1, 'Afrikaans', 'af', 1, '2015-01-29 00:53:14', 10, '2015-01-28 13:53:14', 10),
(2, 'Albanian', 'sq', 1, '2015-01-29 00:53:14', 10, '2015-01-28 13:53:14', 10),
(3, 'Arabic', 'ar', 1, '2015-01-29 00:53:15', 10, '2015-01-28 13:53:15', 10),
(4, 'Azerbaijani', 'az', 1, '2015-01-29 00:53:15', 10, '2015-01-28 13:53:15', 10),
(5, 'Basque', 'eu', 1, '2015-01-29 00:53:15', 10, '2015-01-28 13:53:15', 10),
(6, 'Bengali', 'bn', 1, '2015-01-29 00:53:16', 10, '2015-01-28 13:53:16', 10),
(7, 'Belarusian', 'be', 1, '2015-01-29 00:53:16', 10, '2015-01-28 13:53:16', 10),
(8, 'Bulgarian', 'bg', 1, '2015-01-29 00:53:16', 10, '2015-01-28 13:53:16', 10),
(9, 'Catalan', 'ca', 1, '2015-01-29 00:53:16', 10, '2015-01-28 13:53:16', 10),
(10, 'Chinese Simplified', 'zh-CN', 1, '2015-01-29 00:53:17', 10, '2015-01-28 13:53:17', 10),
(11, 'Chinese Traditional', 'zh-TW', 1, '2015-01-29 00:53:17', 10, '2015-01-28 13:53:17', 10),
(12, 'Croatian', 'hr', 1, '2015-01-29 00:53:17', 10, '2015-01-28 13:53:17', 10),
(13, 'Czech', 'cs', 1, '2015-01-29 00:53:17', 10, '2015-01-28 13:53:17', 10),
(14, 'Danish', 'da', 1, '2015-01-29 00:53:18', 10, '2015-01-28 13:53:18', 10),
(15, 'Dutch', 'nl', 1, '2015-01-29 00:53:18', 10, '2015-01-28 13:53:18', 10),
(16, 'English', 'en', 1, '2015-01-29 00:53:18', 10, '2015-01-28 13:53:18', 10),
(17, 'Esperanto', 'eo', 1, '2015-01-29 00:53:19', 10, '2015-01-28 13:53:19', 10),
(18, 'Estonian', 'et', 1, '2015-01-29 00:53:19', 10, '2015-01-28 13:53:19', 10),
(19, 'Filipino', 'tl', 1, '2015-01-29 00:53:19', 10, '2015-01-28 13:53:19', 10),
(20, 'Finnish', 'fi', 1, '2015-01-29 00:53:19', 10, '2015-01-28 13:53:19', 10),
(21, 'French', 'fr', 1, '2015-01-29 00:53:20', 10, '2015-01-28 13:53:20', 10),
(22, 'Galician', 'gl', 1, '2015-01-29 00:53:20', 10, '2015-01-28 13:53:20', 10),
(23, 'Georgian', 'ka', 1, '2015-01-29 00:53:20', 10, '2015-01-28 13:53:20', 10),
(24, 'German', 'de', 1, '2015-01-29 00:53:20', 10, '2015-01-28 13:53:20', 10),
(25, 'Greek', 'el', 1, '2015-01-29 00:53:21', 10, '2015-01-28 13:53:21', 10),
(26, 'Gujarati', 'gu', 1, '2015-01-29 00:53:21', 10, '2015-01-28 13:53:21', 10),
(27, 'Haitian Creole', 'ht', 1, '2015-01-29 00:53:21', 10, '2015-01-28 13:53:21', 10),
(28, 'Hebrew', 'iw', 1, '2015-01-29 00:53:22', 10, '2015-01-28 13:53:22', 10),
(29, 'Hindi', 'hi', 1, '2015-01-29 00:53:22', 10, '2015-01-28 13:53:22', 10),
(30, 'Hungarian', 'hu', 1, '2015-01-29 00:53:22', 10, '2015-01-28 13:53:22', 10),
(31, 'Icelandic', 'is', 1, '2015-01-29 00:53:22', 10, '2015-01-28 13:53:22', 10),
(32, 'Indonesian', 'id', 1, '2015-01-29 00:53:23', 10, '2015-01-28 13:53:23', 10),
(33, 'Irish', 'ga', 1, '2015-01-29 00:53:23', 10, '2015-01-28 13:53:23', 10),
(34, 'Italian', 'it', 1, '2015-01-29 00:53:23', 10, '2015-01-28 13:53:23', 10),
(35, 'Japanese', 'ja', 1, '2015-01-29 00:53:23', 10, '2015-01-28 13:53:23', 10),
(36, 'Kannada', 'kn', 1, '2015-01-29 00:53:24', 10, '2015-01-28 13:53:24', 10),
(37, 'Korean', 'ko', 1, '2015-01-29 00:53:24', 10, '2015-01-28 13:53:24', 10),
(38, 'Latin', 'la', 1, '2015-01-29 00:53:24', 10, '2015-01-28 13:53:24', 10),
(39, 'Latvian', 'lv', 1, '2015-01-29 00:53:25', 10, '2015-01-28 13:53:25', 10),
(40, 'Lithuanian', 'lt', 1, '2015-01-29 00:53:25', 10, '2015-01-28 13:53:25', 10),
(41, 'Macedonian', 'mk', 1, '2015-01-29 00:53:25', 10, '2015-01-28 13:53:25', 10),
(42, 'Malay', 'ms', 1, '2015-01-29 00:53:25', 10, '2015-01-28 13:53:25', 10),
(43, 'Maltese', 'mt', 1, '2015-01-29 00:53:26', 10, '2015-01-28 13:53:26', 10),
(44, 'Norwegian', 'no', 1, '2015-01-29 00:53:26', 10, '2015-01-28 13:53:26', 10),
(45, 'Persian', 'fa', 1, '2015-01-29 00:53:26', 10, '2015-01-28 13:53:26', 10),
(46, 'Polish', 'pl', 1, '2015-01-29 00:53:26', 10, '2015-01-28 13:53:26', 10),
(47, 'Portuguese', 'pt', 1, '2015-01-29 00:53:27', 10, '2015-01-28 13:53:27', 10),
(48, 'Romanian', 'ro', 1, '2015-01-29 00:53:27', 10, '2015-01-28 13:53:27', 10),
(49, 'Russian', 'ru', 1, '2015-01-29 00:53:27', 10, '2015-01-28 13:53:27', 10),
(50, 'Serbian', 'sr', 1, '2015-01-29 00:53:28', 10, '2015-01-28 13:53:28', 10),
(51, 'Slovak', 'sk', 1, '2015-01-29 00:53:28', 10, '2015-01-28 13:53:28', 10),
(52, 'Slovenian', 'sl', 1, '2015-01-29 00:53:28', 10, '2015-01-28 13:53:28', 10),
(53, 'Spanish', 'es', 1, '2015-01-29 00:53:28', 10, '2015-01-28 13:53:28', 10),
(54, 'Swahili', 'sw', 1, '2015-01-29 00:53:29', 10, '2015-01-28 13:53:29', 10),
(55, 'Swedish', 'sv', 1, '2015-01-29 00:53:29', 10, '2015-01-28 13:53:29', 10),
(56, 'Tamil', 'ta', 1, '2015-01-29 00:53:29', 10, '2015-01-28 13:53:29', 10),
(57, 'Telugu', 'te', 1, '2015-01-29 00:53:29', 10, '2015-01-28 13:53:29', 10),
(58, 'Thai', 'th', 1, '2015-01-29 00:53:30', 10, '2015-01-28 13:53:30', 10),
(59, 'Turkish', 'tr', 1, '2015-01-29 00:53:30', 10, '2015-01-28 13:53:30', 10),
(60, 'Ukrainian', 'uk', 1, '2015-01-29 00:53:30', 10, '2015-01-28 13:53:30', 10),
(61, 'Urdu', 'ur', 1, '2015-01-29 00:53:31', 10, '2015-01-28 13:53:31', 10),
(62, 'Vietnamese', 'vi', 1, '2015-01-29 00:53:31', 10, '2015-01-28 13:53:31', 10),
(63, 'Welsh', 'cy', 1, '2015-01-29 00:53:31', 10, '2015-01-28 13:53:31', 10),
(64, 'Yiddish', 'yi', 1, '2015-01-29 00:53:31', 10, '2015-01-28 13:53:31', 10);
SET FOREIGN_KEY_CHECKS=1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
