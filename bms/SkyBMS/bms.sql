-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 13, 2024 at 10:43 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bms`
--

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `id` char(36) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`name`, `address`, `id`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`, `image`) VALUES
('Jabulani', 'Megenagna', '242fb19b-1ed4-40a4-ab36-5444d0984257', 'test', NULL, '2024-07-25 08:45:34', '2024-08-13 01:03:33', NULL, '1723521813.JPG'),
('Jabulani', 'Merkato', 'f02fa861-ef9e-4507-a450-cc00456b1146', 'test', NULL, '2024-07-24 05:51:41', '2024-08-13 01:00:12', NULL, '1723521612.JPG');

-- --------------------------------------------------------

--
-- Table structure for table `building_units`
--

CREATE TABLE `building_units` (
  `id` char(36) NOT NULL,
  `building_id` char(36) NOT NULL,
  `floor_no` varchar(255) NOT NULL,
  `unit_number` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `width` double DEFAULT NULL,
  `length` double DEFAULT NULL,
  `area_in_sqm` double DEFAULT NULL,
  `price_per_meter_sq` double DEFAULT NULL,
  `estimate_price` double DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `building_units`
--

INSERT INTO `building_units` (`id`, `building_id`, `floor_no`, `unit_number`, `image`, `room_type`, `width`, `length`, `area_in_sqm`, `price_per_meter_sq`, `estimate_price`, `status`, `created_at`, `updated_at`) VALUES
('08faa165-f893-4660-bc08-8c6a80feb997', 'f02fa861-ef9e-4507-a450-cc00456b1146', 'B1', '01', 'default-image.jpg', '5', NULL, NULL, 6, 1200, 0, 'Available', '2024-07-27 01:54:54', '2024-08-05 06:16:31'),
('1b865cc0-4445-4446-ab1f-46ee739805eb', '242fb19b-1ed4-40a4-ab36-5444d0984257', '02', '04', 'default-image.jpg', '5', NULL, NULL, 9, 2400, 0, 'Occupied', '2024-08-11 03:13:37', '2024-08-12 22:16:05'),
('4ae79945-1181-4ff8-847c-e48069495cf1', 'f02fa861-ef9e-4507-a450-cc00456b1146', '1', '002', '1722827244.jpeg', '9', 6, 6, 36, 2000, 0, 'Occupied', '2024-08-05 00:07:24', '2024-08-13 01:38:47'),
('b87ef2c9-4c5f-4441-abe7-eb336a3f1686', 'f02fa861-ef9e-4507-a450-cc00456b1146', 'G', '01', 'default-image.jpg', '13', NULL, NULL, 6.5, 6500, 0, 'Occupied', '2024-07-27 04:59:55', '2024-08-10 04:40:04'),
('f629c5ce-837a-486f-beff-db2ea60135bd', 'f02fa861-ef9e-4507-a450-cc00456b1146', 'B2', '7', '1723525801.jpg', '4', 0, 0, NULL, 0, 9852, 'Occupied', '2024-08-11 03:05:56', '2024-09-10 06:21:27');

-- --------------------------------------------------------

--
-- Table structure for table `building_unit_room_types`
--

CREATE TABLE `building_unit_room_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `building_unit_room_types`
--

INSERT INTO `building_unit_room_types` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Office', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(2, 'Shop', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(3, 'Apartment', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(4, 'Conference Room', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(5, 'Storage Room', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(6, 'Restaurant', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(7, 'Gym', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(8, 'Studio', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(9, 'Clinic', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(10, 'Classroom', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(11, 'Cafeteria', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(12, 'Bar', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(13, 'Theater', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(14, 'Event Space', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(15, 'Service', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(16, 'Finance', '2024-07-24 10:39:29', '2024-07-24 10:39:29'),
(17, 'Other', '2024-07-24 10:39:29', '2024-07-24 10:39:29');

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` char(36) NOT NULL,
  `owner_id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `business_address` varchar(255) DEFAULT NULL,
  `business_phone_number` varchar(255) NOT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `type_of_business` varchar(255) NOT NULL,
  `number_of_years_in_business` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`id`, `owner_id`, `name`, `business_address`, `business_phone_number`, `business_email`, `type_of_business`, `number_of_years_in_business`, `created_at`, `updated_at`) VALUES
('58fc542e-6857-465e-9f38-c54801d85bcf', 'a27a49de-08c6-4ef4-8ad6-c521df276bcd', 'Test Business', 'Megenagna', '0941797542', 'test@gmail.com', '16', 2, '2024-08-10 03:33:29', '2024-08-10 03:33:29'),
('e4fd4e1f-b90c-4660-8985-47874b408a8d', 'a27a49de-08c6-4ef4-8ad6-c521df276bcd', 'new g', 'megenagna', '0941798755', 'test@gmail.com', '15', 5, '2024-08-11 04:06:53', '2024-08-11 23:58:08');

-- --------------------------------------------------------

--
-- Table structure for table `business_owners`
--

CREATE TABLE `business_owners` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `citizenship` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business_owners`
--

INSERT INTO `business_owners` (`id`, `user_id`, `citizenship`, `created_at`, `updated_at`) VALUES
('03dc2443-8273-4454-b80c-bec923094a2e', 47, NULL, '2024-09-13 04:50:18', '2024-09-13 04:50:18'),
('a27a49de-08c6-4ef4-8ad6-c521df276bcd', 20, 'Ethiopian', '2024-08-10 03:32:47', '2024-08-10 03:32:47');

-- --------------------------------------------------------

--
-- Table structure for table `business_types`
--

CREATE TABLE `business_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business_types`
--

INSERT INTO `business_types` (`id`, `name`, `group`, `created_at`, `updated_at`) VALUES
(1, 'Retail', 'Sales', '2024-09-10 04:12:00', '2024-09-10 04:12:00'),
(2, 'Restaurant', 'Food', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(3, 'Technology', 'IT', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(4, 'Consulting', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(5, 'Construction', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(6, 'Healthcare', 'Medical', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(7, 'Hospitality', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(8, 'Education', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(9, 'Automotive', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(10, 'Finance', 'Financial', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(11, 'Real Estate', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(12, 'Legal', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(13, 'Marketing', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(14, 'Insurance', 'Financial', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(15, 'Entertainment', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(16, 'Travel', 'Services', '2024-09-10 04:12:01', '2024-09-10 04:12:01'),
(17, 'Fashion', 'Sales', '2024-09-10 04:12:02', '2024-09-10 04:12:02'),
(18, 'Fitness', 'Health', '2024-09-10 04:12:02', '2024-09-10 04:12:02'),
(19, 'Media', 'Services', '2024-09-10 04:12:02', '2024-09-10 04:12:02'),
(20, 'Telecommunications', 'IT', '2024-09-10 04:12:02', '2024-09-10 04:12:02'),
(21, 'Other', 'Other', '2024-09-10 04:12:02', '2024-09-10 04:12:02');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('a6cf3449fbccdc26d9aeadb6f26b8c25', 'i:1;', 1723350363),
('a6cf3449fbccdc26d9aeadb6f26b8c25:timer', 'i:1723350363;', 1723350363),
('admin@admin.com|127.0.0.1', 'i:1;', 1723350364),
('admin@admin.com|127.0.0.1:timer', 'i:1723350364;', 1723350364),
('c525a5357e97fef8d3db25841c86da1a', 'i:1;', 1723350383),
('c525a5357e97fef8d3db25841c86da1a:timer', 'i:1723350383;', 1723350383);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `failed_jobs`
--

INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES
(1, 'e5bd0665-6f72-4c60-90cf-433ae07aff4b', 'database', 'default', '{\"uuid\":\"e5bd0665-6f72-4c60-90cf-433ae07aff4b\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:2:\\\"11\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";N;s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 'Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Notification]. in D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:637\nStack trace:\n#0 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(109): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(62): App\\Events\\NotificationEvent->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(93): App\\Events\\NotificationEvent->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Events\\NotificationEvent->__unserialize(Array)\n#4 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(98): unserialize(\'O:38:\"Illuminat...\')\n#5 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(61): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(333): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#10 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(139): Illuminate\\Queue\\Worker->runNextJob(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#11 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(122): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#12 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(213): Illuminate\\Container\\Container->call(Array)\n#18 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Command\\Command.php(279): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(182): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(1047): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(316): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(167): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1203): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 D:\\bms-system\\services\\bms-services\\artisan(13): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}', '2024-08-30 23:56:31'),
(2, 'e82c04b8-ffd8-471d-96ee-29e849a59402', 'database', 'default', '{\"uuid\":\"e82c04b8-ffd8-471d-96ee-29e849a59402\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:2:\\\"11\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";N;s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 'Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Notification]. in D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:637\nStack trace:\n#0 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(109): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(62): App\\Events\\NotificationEvent->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(93): App\\Events\\NotificationEvent->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Events\\NotificationEvent->__unserialize(Array)\n#4 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(98): unserialize(\'O:38:\"Illuminat...\')\n#5 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(61): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(333): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#10 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(139): Illuminate\\Queue\\Worker->runNextJob(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#11 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(122): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#12 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(213): Illuminate\\Container\\Container->call(Array)\n#18 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Command\\Command.php(279): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(182): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(1047): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(316): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(167): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1203): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 D:\\bms-system\\services\\bms-services\\artisan(13): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}', '2024-08-30 23:56:33'),
(3, '7dc7120a-59e9-48a4-8804-a467a22fc533', 'database', 'default', '{\"uuid\":\"7dc7120a-59e9-48a4-8804-a467a22fc533\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:2:\\\"11\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";N;s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 'Illuminate\\Database\\Eloquent\\ModelNotFoundException: No query results for model [App\\Models\\Notification]. in D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Eloquent\\Builder.php:637\nStack trace:\n#0 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(109): Illuminate\\Database\\Eloquent\\Builder->firstOrFail()\n#1 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesAndRestoresModelIdentifiers.php(62): App\\Events\\NotificationEvent->restoreModel(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#2 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\SerializesModels.php(93): App\\Events\\NotificationEvent->getRestoredPropertyValue(Object(Illuminate\\Contracts\\Database\\ModelIdentifier))\n#3 [internal function]: App\\Events\\NotificationEvent->__unserialize(Array)\n#4 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(98): unserialize(\'O:38:\"Illuminat...\')\n#5 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(61): Illuminate\\Queue\\CallQueuedHandler->getCommand(Array)\n#6 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#7 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#8 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#9 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(333): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#10 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(139): Illuminate\\Queue\\Worker->runNextJob(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#11 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(122): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#12 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#13 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#14 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#15 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#16 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#17 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(213): Illuminate\\Container\\Container->call(Array)\n#18 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Command\\Command.php(279): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#19 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(182): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#20 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(1047): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#21 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(316): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#22 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(167): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#23 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#24 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1203): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#25 D:\\bms-system\\services\\bms-services\\artisan(13): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#26 {main}', '2024-08-30 23:56:35'),
(4, 'cd4869b4-a082-483a-9b00-10ad0851349a', 'database', 'default', '{\"uuid\":\"cd4869b4-a082-483a-9b00-10ad0851349a\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"6a901fcf-1170-439c-931e-e9a704a18c39\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 'Illuminate\\Broadcasting\\BroadcastException: Pusher error: cURL error 6: Could not resolve host: api-ap2.pusher.com (see https://curl.haxx.se/libcurl/c/libcurl-errors.html) for https://api-ap2.pusher.com/apps/1841901/events?auth_key=ec6f9d395cad7646844a&auth_timestamp=1725931151&auth_version=1.0&body_md5=e9302391356636250bef7118e7d94943&auth_signature=41c0a2e0ae09a958a15f02b7f7074efb1762ae549959230f28fe7f0307872320. in D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\Broadcasters\\PusherBroadcaster.php:164\nStack trace:\n#0 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastEvent.php(92): Illuminate\\Broadcasting\\Broadcasters\\PusherBroadcaster->broadcast(Object(Illuminate\\Support\\Collection), \'notification-ev...\', Array)\n#1 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Broadcasting\\BroadcastEvent->handle(Object(Illuminate\\Broadcasting\\BroadcastManager))\n#2 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#3 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#4 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#5 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#6 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(128): Illuminate\\Container\\Container->call(Array)\n#7 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#8 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#9 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#10 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(124): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Broadcasting\\BroadcastEvent), false)\n#11 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#12 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#13 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(123): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#14 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(71): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#15 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#16 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#17 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#18 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(333): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#19 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(139): Illuminate\\Queue\\Worker->runNextJob(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(122): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#21 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#22 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#23 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#24 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#25 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#26 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(213): Illuminate\\Container\\Container->call(Array)\n#27 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Command\\Command.php(279): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#28 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(182): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(1047): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#30 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(316): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(167): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1203): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 D:\\bms-system\\services\\bms-services\\artisan(13): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#35 {main}', '2024-09-09 22:19:12'),
(5, 'da681f13-f8d2-4ef4-8847-7f99ca7e152d', 'database', 'default', '{\"uuid\":\"da681f13-f8d2-4ef4-8847-7f99ca7e152d\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"fab37f4d-77cf-4d4b-90ea-57e9134cb44e\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 'Illuminate\\Broadcasting\\BroadcastException: Pusher error: cURL error 6: Could not resolve host: api-ap2.pusher.com (see https://curl.haxx.se/libcurl/c/libcurl-errors.html) for https://api-ap2.pusher.com/apps/1841901/events?auth_key=ec6f9d395cad7646844a&auth_timestamp=1725931175&auth_version=1.0&body_md5=0dfddf7a55ce183a5386d44ee6ec37cd&auth_signature=2b7e41b13a290037c60496226c804aaf756c37f0b6515520688f6e2132e9060d. in D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\Broadcasters\\PusherBroadcaster.php:164\nStack trace:\n#0 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Broadcasting\\BroadcastEvent.php(92): Illuminate\\Broadcasting\\Broadcasters\\PusherBroadcaster->broadcast(Object(Illuminate\\Support\\Collection), \'notification-ev...\', Array)\n#1 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Broadcasting\\BroadcastEvent->handle(Object(Illuminate\\Broadcasting\\BroadcastManager))\n#2 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#3 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#4 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#5 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#6 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(128): Illuminate\\Container\\Container->call(Array)\n#7 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Bus\\Dispatcher->Illuminate\\Bus\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#8 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#9 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Bus\\Dispatcher.php(132): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#10 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(124): Illuminate\\Bus\\Dispatcher->dispatchNow(Object(Illuminate\\Broadcasting\\BroadcastEvent), false)\n#11 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(144): Illuminate\\Queue\\CallQueuedHandler->Illuminate\\Queue\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#12 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(119): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#13 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(123): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))\n#14 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\CallQueuedHandler.php(71): Illuminate\\Queue\\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Broadcasting\\BroadcastEvent))\n#15 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Jobs\\Job.php(102): Illuminate\\Queue\\CallQueuedHandler->call(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Array)\n#16 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(439): Illuminate\\Queue\\Jobs\\Job->fire()\n#17 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(389): Illuminate\\Queue\\Worker->process(\'database\', Object(Illuminate\\Queue\\Jobs\\DatabaseJob), Object(Illuminate\\Queue\\WorkerOptions))\n#18 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Worker.php(333): Illuminate\\Queue\\Worker->runJob(Object(Illuminate\\Queue\\Jobs\\DatabaseJob), \'database\', Object(Illuminate\\Queue\\WorkerOptions))\n#19 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(139): Illuminate\\Queue\\Worker->runNextJob(\'database\', \'default\', Object(Illuminate\\Queue\\WorkerOptions))\n#20 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Queue\\Console\\WorkCommand.php(122): Illuminate\\Queue\\Console\\WorkCommand->runWorker(\'database\', \'default\')\n#21 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Queue\\Console\\WorkCommand->handle()\n#22 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(41): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()\n#23 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(93): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))\n#24 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))\n#25 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(690): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)\n#26 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(213): Illuminate\\Container\\Container->call(Array)\n#27 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Command\\Command.php(279): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#28 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(182): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))\n#29 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(1047): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#30 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(316): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Queue\\Console\\WorkCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#31 D:\\bms-system\\services\\bms-services\\vendor\\symfony\\console\\Application.php(167): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#32 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#33 D:\\bms-system\\services\\bms-services\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1203): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))\n#34 D:\\bms-system\\services\\bms-services\\artisan(13): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))\n#35 {main}', '2024-09-09 22:19:35');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(75, 'default', '{\"uuid\":\"dbdf81a8-140c-4ce3-8211-d3b59353d505\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"7d6c3261-93ec-4d09-900b-2fe13df931e3\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1725958136, 1725958136),
(76, 'default', '{\"uuid\":\"d9cc1fa4-7ba2-4f5b-8921-a3023feb26ae\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"95cdb088-83f9-48e8-b38b-942dde871149\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1725960129, 1725960129),
(77, 'default', '{\"uuid\":\"e22082d7-f9c3-45b7-ba7a-759efd564cd6\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"81f0b207-2414-49be-9919-72388b7119a3\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1725960209, 1725960209),
(78, 'default', '{\"uuid\":\"4485d70e-e3c6-4c5a-b219-f45a6c2d263f\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"249afecd-5b8a-430c-af7e-1d8007e54218\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1725960293, 1725960293),
(79, 'default', '{\"uuid\":\"4f7333d7-9b37-44ec-b7d3-5b79f107e24c\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"cc6f2eb5-5647-4141-9aaa-3db750d21d45\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1725960420, 1725960420),
(80, 'default', '{\"uuid\":\"9940979c-c4dc-41e8-896a-3dceb484e76a\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"af6940ab-aa69-45a8-bee7-cfcc15e61888\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1726211389, 1726211389),
(81, 'default', '{\"uuid\":\"74060949-c7a7-431e-8941-02da8ad088a7\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"3e381dbd-eaa5-4ef0-b840-755d261de90e\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1726211880, 1726211880),
(82, 'default', '{\"uuid\":\"acef6aea-8b62-4e00-9e4c-f4530fdc243e\",\"displayName\":\"App\\\\Events\\\\NotificationEvent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":14:{s:5:\\\"event\\\";O:28:\\\"App\\\\Events\\\\NotificationEvent\\\":1:{s:12:\\\"notification\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:23:\\\"App\\\\Models\\\\Notification\\\";s:2:\\\"id\\\";s:36:\\\"740d2548-bcfc-4551-9705-504a3f893892\\\";s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"}}', 0, NULL, 1726212324, 1726212324);

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leases`
--

CREATE TABLE `leases` (
  `id` char(36) NOT NULL,
  `tenant_id` char(36) NOT NULL,
  `building_unit_id` char(36) DEFAULT NULL,
  `lease_agreement_document` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `monthly_rent` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leases`
--

INSERT INTO `leases` (`id`, `tenant_id`, `building_unit_id`, `lease_agreement_document`, `start_date`, `end_date`, `monthly_rent`, `status`, `created_at`, `updated_at`) VALUES
('342a677b-9235-40c2-8080-55b91535b4e8', 'dcf5c8a5-2309-44a8-954d-ed0b08e3f6c0', '1b865cc0-4445-4446-ab1f-46ee739805eb', 'lease_documents/1723511763_CamScanner 06-22-2024 12.12.pdf', '2024-08-13 15:00:00', '2025-08-12 15:00:00', '21600', 'active', '2024-08-12 22:16:05', '2024-08-13 06:08:45'),
('51419099-e543-412f-8fdc-9a49d18ab3b4', 'a6dbeabb-f7c1-4928-944e-e6cb887ff433', '4ae79945-1181-4ff8-847c-e48069495cf1', 'lease_documents/1723272934_pdf-test.pdf', '2024-08-09 21:00:00', '2024-08-12 21:00:00', '54000', 'active', '2024-08-10 03:55:36', '2024-08-10 04:01:03'),
('fa228eee-4e6d-4519-a17f-c92c3920d308', 'a6dbeabb-f7c1-4928-944e-e6cb887ff433', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', 'lease_documents/1723275602_CamScanner 06-22-2024 12.12.pdf', '2024-08-09 21:00:00', '2025-08-09 21:00:00', '42250', 'active', '2024-08-10 04:40:04', '2024-08-10 04:42:30');

-- --------------------------------------------------------

--
-- Table structure for table `list_of_banks`
--

CREATE TABLE `list_of_banks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `list_of_banks`
--

INSERT INTO `list_of_banks` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Nib International Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(2, 'Abay Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(3, 'Addis International Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(4, 'Amhara Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(5, 'Awash International Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(6, 'Bank of Abyssinia', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(7, 'Berhan International Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(8, 'Bunna International Bank', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(9, 'Commercial Bank of Ethiopia', '2024-09-13 02:34:42', '2024-09-13 02:34:42'),
(10, 'Cooperative Bank of Oromia', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(11, 'Dashen Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(12, 'Global Bank Ethiopia', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(13, 'Enat Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(14, 'Lion International Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(15, 'Oromia International Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(16, 'Hibret Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(17, 'Wegagen Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(18, 'Zemen Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(19, 'ZamZam Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(20, 'Hijra Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(21, 'Siinqee Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(22, 'Ahadu Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43'),
(23, 'Tsedey Bank', '2024-09-13 02:34:43', '2024-09-13 02:34:43');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_contractors`
--

CREATE TABLE `maintenance_contractors` (
  `id` char(36) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `contact_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `maintenance_contractors`
--

INSERT INTO `maintenance_contractors` (`id`, `company_name`, `contact_name`, `email`, `phone`, `created_at`, `updated_at`) VALUES
('dac38cd6-e5e8-430a-bdd7-0805fb9a3a09', 'Test vhjk', 'Alif', NULL, '0941797546', '2024-07-27 05:01:57', '2024-08-12 00:15:08');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_requests`
--

CREATE TABLE `maintenance_requests` (
  `id` char(36) NOT NULL,
  `building_unit_id` char(36) NOT NULL,
  `request_date` date NOT NULL,
  `description` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `maintenance_requests`
--

INSERT INTO `maintenance_requests` (`id`, `building_unit_id`, `request_date`, `description`, `status`, `created_at`, `updated_at`) VALUES
('01f8be73-2cf5-4fa8-a15d-dd7d723d9b2b', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'bb', 'pending', '2024-08-30 23:54:48', '2024-08-30 23:54:48'),
('0333d9b5-f565-4005-ac79-33d9908c44b9', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'sds', 'pending', '2024-08-30 22:17:12', '2024-08-30 22:17:12'),
('05d35f8f-bc81-4e40-98c9-f5c0fad75714', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-31', 'new test', 'pending', '2024-08-30 21:47:54', '2024-08-30 21:47:54'),
('18affa62-3a3f-4eb8-b5bb-e380676f2ae0', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'dfsdf', 'pending', '2024-08-27 09:16:24', '2024-08-27 09:16:24'),
('18fd983c-d87f-4215-9d68-97cb9011af2d', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'sa', 'pending', '2024-08-30 22:20:09', '2024-08-30 22:20:09'),
('1c14c63a-5a33-4d56-b5f3-9b9edf051eef', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-10', 'በር ተበላሽቶብኛል', 'completed', '2024-08-10 04:44:22', '2024-08-29 00:33:38'),
('1e73cbbd-6f15-4cd1-8168-a526786bd17a', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'hh', 'pending', '2024-08-31 00:28:40', '2024-08-31 00:28:40'),
('1eb7ff27-a062-484f-b50b-5589e0d4e517', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'bb', 'pending', '2024-08-31 00:18:14', '2024-08-31 00:18:14'),
('1f2fb424-96d1-45a0-bb15-c83bb0cd2dfa', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-28', 'hjj', 'pending', '2024-08-27 23:38:59', '2024-08-27 23:38:59'),
('31962fb7-9366-4458-98e0-e888ea7624ab', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-27', 'New Test', 'pending', '2024-08-27 08:07:35', '2024-08-27 08:07:35'),
('375b5764-a5a2-4065-8f26-355ec0c7df5e', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'sdd', 'pending', '2024-08-31 00:03:34', '2024-08-31 00:03:34'),
('3bc4f8cb-e4da-4b14-88ad-a097fbeea462', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'sdfsf', 'pending', '2024-08-27 09:02:07', '2024-08-27 09:02:07'),
('3e8e2a24-c418-4fb2-9d70-873d56d33085', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'ggg', 'pending', '2024-08-31 00:11:05', '2024-08-31 00:11:05'),
('3f27ac28-0f13-45b4-9e95-439a692438e4', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'ddd', 'pending', '2024-08-30 22:45:33', '2024-08-30 22:45:33'),
('422fa06b-189e-4c01-bce5-cf56996397d6', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'hh', 'pending', '2024-08-30 22:09:33', '2024-08-30 22:09:33'),
('427421a9-8d01-4d2f-97c1-2d905d2729b1', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'fsf', 'pending', '2024-08-27 10:27:47', '2024-08-27 10:27:47'),
('46729456-b993-4d9c-a9fb-8311861a3fde', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'bnn', 'pending', '2024-08-31 00:22:55', '2024-08-31 00:22:55'),
('4aed1bcc-3706-4b8e-8b25-2bf4fbc47b32', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-31', 'test', 'pending', '2024-08-30 22:08:26', '2024-08-30 22:08:26'),
('56f90f68-8f7e-4528-8d96-93b00dca6126', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'ggg', 'pending', '2024-08-31 00:18:48', '2024-08-31 00:18:48'),
('5b1e3f8a-31f7-4095-ab74-c6966201727e', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-27', 'sdfsf', 'pending', '2024-08-27 09:04:25', '2024-08-27 09:04:25'),
('5b6898f7-fc70-46c2-aa26-8b754f7fdbc4', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'bb', 'pending', '2024-08-31 00:15:59', '2024-08-31 00:15:59'),
('6111ed90-81e3-428c-b99a-9b56b25e5ea3', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'Test', 'pending', '2024-08-27 07:57:30', '2024-08-27 07:57:30'),
('64a0b02b-967d-407e-bb91-3d3245438657', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'sdfsf', 'pending', '2024-08-27 09:05:16', '2024-08-27 09:05:16'),
('6d2b513b-9b06-437e-9b28-641a9df42290', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-09-10', 'jhj', 'pending', '2024-09-09 22:24:52', '2024-09-09 22:24:52'),
('70b6fab2-cf3f-4d5d-ab1b-d337f27ea248', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'hh', 'pending', '2024-08-31 00:28:01', '2024-08-31 00:28:01'),
('7104f1b2-94ce-4b71-b421-d15f26da0dd8', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-10', 'test', 'pending', '2024-09-09 22:19:33', '2024-09-09 22:19:33'),
('717b6368-d2b5-453a-ab55-5622331f162c', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'sdsccc', 'pending', '2024-08-27 09:09:38', '2024-08-27 09:09:38'),
('71ba5eac-8bc0-418a-9114-bb219e092dfd', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-09-10', 'Check', 'pending', '2024-09-09 22:10:04', '2024-09-09 22:10:04'),
('75cf7495-0ec7-4f6d-b911-b02afdb07e7a', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'gg', 'pending', '2024-08-31 00:19:31', '2024-08-31 00:19:31'),
('791797e1-494c-4a67-95a0-cf11bf944e70', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-27', 'dcdc', 'pending', '2024-08-27 10:28:43', '2024-08-27 10:28:43'),
('7a225de1-ed9f-49b6-8d10-4ef1452e0d72', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', ',mml', 'pending', '2024-08-27 10:40:24', '2024-08-27 10:40:24'),
('7c8fc0a4-dc05-4229-bb7a-3b986ce1fab3', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'sdfsfs', 'pending', '2024-08-27 10:38:55', '2024-08-27 10:38:55'),
('7d766ba8-a2f8-4951-97c6-9ca41b266020', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'm', 'pending', '2024-08-30 23:22:24', '2024-08-30 23:22:24'),
('8985f9c5-0f32-41ce-a142-e87877ad3632', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'bb', 'pending', '2024-08-31 00:15:27', '2024-08-31 00:15:27'),
('8a71fc5f-ed06-4954-8788-dd4cd653100f', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-28', 'jhj', 'pending', '2024-08-27 23:44:45', '2024-08-27 23:44:45'),
('8c42886f-153e-4d0e-8bdd-1e19d8b716ba', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'wefwewf', 'pending', '2024-08-27 09:14:45', '2024-08-27 09:14:45'),
('8e112ec3-683e-45c3-bf65-dadb8bfa1d9c', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'hhh', 'pending', '2024-08-30 22:10:02', '2024-08-30 22:10:02'),
('8f2a8c0f-cb8f-45df-a8c3-a62beb137085', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'fff', 'pending', '2024-08-31 00:11:33', '2024-08-31 00:11:33'),
('91f1fb30-1d8b-41ee-a52d-6cfbb006def4', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'ss', 'pending', '2024-08-31 00:10:06', '2024-08-31 00:10:06'),
('951bad09-ae0a-4e39-a188-569acfba2594', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-31', 'jj', 'pending', '2024-08-30 22:08:47', '2024-08-30 22:08:47'),
('9a6d7188-8515-4718-b05c-26a205db79ef', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'hh', 'pending', '2024-08-31 00:26:35', '2024-08-31 00:26:35'),
('9c3288d5-6130-4877-b861-e7d00dc7399a', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10', 'please fix my door', 'pending', '2024-08-10 03:59:58', '2024-08-10 03:59:58'),
('9cf6169d-7879-4054-bbb8-c0ca0a510f37', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'nnn', 'pending', '2024-08-31 00:16:28', '2024-08-31 00:16:28'),
('b36d9437-f468-4552-8755-e75bb39034cc', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'mmm', 'pending', '2024-08-30 23:23:05', '2024-08-30 23:23:05'),
('b9e50e85-8852-44c7-a3e3-9aa24b5ce1ef', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'hhh', 'pending', '2024-08-30 22:09:00', '2024-08-30 22:09:00'),
('bcbbb98a-5cea-4cb0-85c7-2b3f8af624a0', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'sdd', 'pending', '2024-08-30 22:10:59', '2024-08-30 22:10:59'),
('c8c9c950-f269-4008-87f0-7bf43c65e8d4', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'sdsd', 'pending', '2024-08-27 10:36:22', '2024-08-27 10:36:22'),
('c9622b6c-66d4-4b65-9599-f0f5f6afa2a3', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'ff', 'pending', '2024-08-30 22:10:32', '2024-08-30 22:10:32'),
('ccb30a17-1a5a-42b5-9e42-3e40170a5089', '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-31', 'Test', 'pending', '2024-08-30 21:45:58', '2024-08-30 21:45:58'),
('cfac5626-d7cc-4a80-904c-9d7e82cec4bc', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27', 'sdsfsdf', 'pending', '2024-08-27 09:13:20', '2024-08-27 09:13:20'),
('d5ef2063-6870-4dda-bf3a-a1b6e7c18acd', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'sfs', 'pending', '2024-08-30 22:53:59', '2024-08-30 22:53:59'),
('e13487eb-79f4-4605-9ee2-4fc28c706fb6', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-27', 'sds', 'pending', '2024-08-27 08:28:02', '2024-08-27 08:28:02'),
('e7b61981-5146-4703-a846-306e1b2bec30', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-27', 'Test', 'pending', '2024-08-27 08:03:59', '2024-08-27 08:03:59'),
('eb30ce1d-385e-4570-995c-3b5468cb77fa', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'hhh', 'pending', '2024-08-31 00:05:50', '2024-08-31 00:05:50'),
('ee194f62-6fbb-4388-a512-46d0a8666d98', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'gg', 'pending', '2024-08-31 00:17:42', '2024-08-31 00:17:42'),
('f6f541e5-4b95-4391-864c-7fed3848b7bd', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'hh', 'pending', '2024-08-31 00:13:11', '2024-08-31 00:13:11'),
('fc19467e-1e88-40f0-977d-4a631d360974', 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31', 'hhh', 'pending', '2024-08-31 00:22:38', '2024-08-31 00:22:38'),
('ff58914d-77de-4acd-a865-62269f8ca2b1', '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31', 'hhh', 'pending', '2024-08-31 00:20:45', '2024-08-31 00:20:45');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(5, '2024_05_20_211621_create_personal_access_tokens_table', 1),
(6, '2024_05_21_175647_create_posts_table', 1),
(7, '2024_05_29_183528_create_buildings_table', 1),
(9, '2024_06_08_032347_create_business_owners_table', 1),
(11, '2024_06_08_034045_create_businesses_table', 1),
(12, '2024_06_08_040705_create_tenants_table', 1),
(22, '2024_06_28_222130_create_permission_tables', 5),
(23, '2024_06_28_230757_create_role_user_table', 6),
(26, '2024_06_17_192527_create_leases_table', 8),
(32, '2024_07_05_180127_create_payments_table', 9),
(34, '2024_07_20_032302_create_maintenance_requests_table', 11),
(48, '0001_01_01_000000_create_users_table', 14),
(49, '2024_05_20_211435_add_two_factor_columns_to_users_table', 14),
(52, '2024_06_01_031819_create_building_units_table', 15),
(53, '2024_07_24_131249_create_building_unit_room_types_table', 16),
(54, '2024_07_20_034128_create_maintenance_contractors_table', 17),
(56, '2024_07_20_040029_create_work_orders_table', 18),
(63, '2024_08_02_081609_create_notifications_table', 20),
(64, '2024_08_09_071626_create_permission_user_table', 21),
(65, '2024_06_08_033953_create_business_types_table', 22),
(66, '2024_08_02_081227_create_sms_table', 23),
(67, '2024_09_13_045929_create_list_of_banks_table', 24);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `notifiable` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `data` text NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `unit` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `notifiable`, `type`, `data`, `read`, `unit`, `created_at`, `updated_at`) VALUES
('01d4eb27-9c06-4cba-b18c-f4af3d280115', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"1c14c63a-5a33-4d56-b5f3-9b9edf051eef\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-10 04:44:22', '2024-09-09 22:24:06'),
('0338c6ed-3890-4e4f-a256-f52e143a6974', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"f6f541e5-4b95-4391-864c-7fed3848b7bd\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:13:12', '2024-09-09 22:24:06'),
('045590e4-d411-4083-840d-d4385e90a46c', '20', 'Tenant Payment Created', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 04:01:04', '2024-09-10 05:49:18'),
('047d374b-e587-4545-a1d4-93aa3a9d3424', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"717b6368-d2b5-453a-ab55-5622331f162c\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 09:09:38', '2024-09-09 22:24:06'),
('0514a465-94a5-46b3-b4bf-1908f0350b3a', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-09 22:23:44', '2024-09-09 22:24:06'),
('089bd982-a9b5-4e78-b359-c0d1722faf73', '20', 'Tenant Payment Approved', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-16 20:25:09', '2024-09-10 05:49:19'),
('094b6c20-6b1c-47ac-aee2-fc528578bf6f', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 10:08:05', '2024-09-09 22:24:06'),
('0a265d8d-c837-40ef-b854-b1ec78b44234', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"1f2fb424-96d1-45a0-bb15-c83bb0cd2dfa\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 23:39:00', '2024-09-09 22:24:06'),
('0ab20e51-76b1-48bf-9839-5348d121bb1f', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 05:26:46', '2024-09-09 22:24:07'),
('0cff90e8-f735-42e8-af50-b07f6813ebee', '20', 'Tenant Payment Created', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 04:41:19', '2024-09-10 05:49:19'),
('0e52d880-4c80-4566-a36f-097e78ff6498', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-09 22:22:12', '2024-09-09 22:24:07'),
('0f50f788-de58-4062-a46a-135dd05646d1', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"b6e5053f-5a17-4bee-8360-4d3f38b1e39f\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 05:09:08', '2024-09-09 22:24:07'),
('10b4a17a-b140-432a-a38b-4c9291d3f1db', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 21:44:08', '2024-09-09 22:24:07'),
('125df5f9-fbdc-4df0-8f79-2a9f31d3f2fe', '3', 'Tenant Payment Created', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 09:08:43', '2024-08-07 09:16:23'),
('135d7728-6947-4e41-bf56-c0a5d8ddf530', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"05d35f8f-bc81-4e40-98c9-f5c0fad75714\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-30 21:47:54', '2024-09-09 22:24:07'),
('153d403d-da27-41ba-b66a-1cd74d23517d', '20', 'Tenant Payment Created', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:40:48', '2024-09-10 05:49:19'),
('1571973c-ac2e-4448-888f-cf785de7153e', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"c31527d1-3ee0-49ba-ab4a-a18a003c37ac\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 05:10:26', '2024-09-09 22:24:07'),
('15d2c5b7-9f39-44c9-a5b2-c1ba452d9ee2', '3', 'Tenant Payment Rejected', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 09:16:03', '2024-08-07 09:16:23'),
('1ab46995-814c-4913-8192-54409552d30e', '20', 'Tenant Payment Created', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-16 20:27:28', '2024-09-10 05:49:20'),
('1d76c542-7551-4cc6-b99e-becf427635c5', '3', 'Payment Due Soon (1 Week)', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 09:07:32', '2024-08-07 09:16:23'),
('1e3fa41a-d2cb-42fb-a90b-40638f01b02e', '20', 'Tenant Payment Created', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-10 04:42:30', '2024-09-10 05:49:20'),
('1e6ad036-b82e-47a9-8319-c411b55b8b4e', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"7c8fc0a4-dc05-4229-bb7a-3b986ce1fab3\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 10:38:56', '2024-09-09 22:24:07'),
('1f1c1822-6ba1-48a2-8db5-870bf3d05090', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"31962fb7-9366-4458-98e0-e888ea7624ab\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-27 08:07:35', '2024-09-09 22:24:07'),
('234eca43-b9aa-4294-a0b2-11b111519159', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"4aed1bcc-3706-4b8e-8b25-2bf4fbc47b32\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-30 22:08:26', '2024-09-09 22:24:07'),
('249afecd-5b8a-430c-af7e-1d8007e54218', '37', 'Tenant Payment Created', 'B2 - 7', 1, 'f629c5ce-837a-486f-beff-db2ea60135bd', '2024-09-10 06:24:53', '2024-09-10 06:27:47'),
('29cf4052-7162-4a05-a2f2-a7bcb96ce37c', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"559d58e8-84ba-4356-b7f8-002cc4893a53\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 00:17:24', '2024-09-09 22:24:07'),
('2d5aeced-d390-4470-a4de-f13b59374b8b', '20', 'Tenant Payment Rejected', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-09 22:24:32', '2024-09-10 05:49:20'),
('33a32f17-964d-484c-b4e9-13d79a70969e', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"c8c9c950-f269-4008-87f0-7bf43c65e8d4\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 10:36:22', '2024-09-09 22:24:07'),
('346a6a51-2a10-4a59-b37f-6de57b93fef1', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 10:11:45', '2024-09-09 22:24:07'),
('35a1f1bf-781c-4e27-8ea9-7bc469db0579', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"e7b61981-5146-4703-a846-306e1b2bec30\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-27 08:03:59', '2024-09-09 22:24:07'),
('35ed44f5-fa7a-4a8b-8b3d-b9cc851a16d5', '20', 'Tenant Payment Rejected', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-09 22:21:50', '2024-09-10 05:49:20'),
('35ff6766-4cb8-4bb4-a93d-9da616726a5a', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 09:36:09', '2024-09-09 22:24:07'),
('36296659-5262-4897-9fe9-86ed5e7d7db6', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"b9e50e85-8852-44c7-a3e3-9aa24b5ce1ef\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:09:00', '2024-09-09 22:24:07'),
('36b8895d-d0ac-464c-87d7-e9239d2c9e7e', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"422fa06b-189e-4c01-bce5-cf56996397d6\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:09:33', '2024-09-09 22:24:07'),
('38743a60-fc54-4287-bac0-56fc65d1573e', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"f1d46025-1cc5-4407-9a7d-5717012c29bf\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 00:18:29', '2024-09-09 22:24:07'),
('38fea84c-4d6e-429e-8f44-16ddd5f69fd3', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"56f90f68-8f7e-4528-8d96-93b00dca6126\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:18:48', '2024-09-09 22:24:07'),
('396bb2fa-5b52-4fa4-b549-52e626743616', '2', 'Tenant Payment', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 01:08:29', '2024-09-09 22:24:07'),
('3b3d1a90-1918-4dc6-b4b5-ea8411d4a9f7', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"70b6fab2-cf3f-4d5d-ab1b-d337f27ea248\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:28:02', '2024-09-09 22:24:07'),
('3e381dbd-eaa5-4ef0-b840-755d261de90e', '2', 'Tenant Payment Attached', '02 - 04', 0, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-13 04:18:00', '2024-09-13 04:18:00'),
('402e4493-b853-4050-a1ae-b55d9da3e935', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"6d2b513b-9b06-437e-9b28-641a9df42290\"}', 0, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-09-09 22:24:52', '2024-09-09 22:24:52'),
('40ab3cb1-ae69-4213-8c4a-ec09793fe22e', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"3e8e2a24-c418-4fb2-9d70-873d56d33085\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:11:05', '2024-09-09 22:24:08'),
('442bd397-7498-4ec2-b2ad-9a4ecfe9ab5d', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"75cf7495-0ec7-4f6d-b911-b02afdb07e7a\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:19:31', '2024-09-09 22:24:08'),
('46a9324c-d02c-4b9e-9aa8-844ca9a58925', '20', 'Tenant Payment Rejected', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-09 22:22:53', '2024-09-10 05:49:20'),
('4944c470-7da2-4370-90b5-77d0adc2707b', '3', 'Lease Expiration Warning (1 Week)', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 05:20:26', '2024-08-07 09:16:23'),
('4a70e7fc-7208-4f36-ba4e-febbc03844b1', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 21:31:14', '2024-09-09 22:24:08'),
('4a8e8290-db8a-4eb1-9257-60525ed0baf8', '3', 'Payment Due Today', '1 - 002 (Payment Due)', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 05:59:14', '2024-08-07 09:16:23'),
('4abd5adf-6c33-45f1-9a88-256f3148b6b9', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:36:11', '2024-09-09 22:24:08'),
('4c959a58-94e9-4ef9-ba17-600644b740bb', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 23:00:00', '2024-09-09 22:24:08'),
('4cbb2869-6b83-4183-b17b-9c913a2f74d6', '20', 'Tenant Payment Created', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:30:29', '2024-09-10 05:49:20'),
('4d099076-cf1d-419e-b652-169e1412d793', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"8f2a8c0f-cb8f-45df-a8c3-a62beb137085\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:11:33', '2024-09-09 22:24:08'),
('4de1fe92-124c-4f0f-ad7f-99ce6ccc633d', '20', 'Payment Due Today', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 04:01:18', '2024-09-10 05:49:20'),
('50860ae8-f40c-4656-82f9-4901f4fc347d', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-16 20:23:53', '2024-09-09 22:24:08'),
('5298a262-754c-457f-a2c6-aa7a4977676e', '20', 'Tenant Payment Approved', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-16 21:40:19', '2024-09-10 05:49:20'),
('549a1d73-b727-4068-babd-24b251b4aa2d', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"1eb7ff27-a062-484f-b50b-5589e0d4e517\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:18:14', '2024-09-09 22:24:08'),
('56ad5ef4-4279-4b3c-99c3-a07aa51c5408', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 10:03:12', '2024-09-09 22:24:08'),
('58742675-73da-46a6-9448-1994251ce70e', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"9cf6169d-7879-4054-bbb8-c0ca0a510f37\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:16:28', '2024-09-09 22:24:08'),
('602cf510-e99f-47a6-9382-0720975a24b0', '20', 'Tenant Payment Rejected', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-09 22:21:45', '2024-09-10 05:49:20'),
('643619ec-affc-4f91-ae1c-dc5029c98d35', '3', 'Tenant Payment Rejected', '1 - 002', 0, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 10:04:01', '2024-08-08 10:04:01'),
('67d7a38f-6193-4153-8ded-b6bae770c0aa', '20', 'Tenant Payment Created', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-11 06:35:14', '2024-09-10 05:49:20'),
('692aac00-58b3-4f11-84bb-3c70aac9c024', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"35dec3a8-9ef6-4827-97f8-55cd92c988cb\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 10:09:11', '2024-09-09 22:24:08'),
('6a8c6da1-6d6d-4d82-86b4-5824261d824a', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"46729456-b993-4d9c-a9fb-8311861a3fde\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:22:55', '2024-09-09 22:24:08'),
('6a901fcf-1170-439c-931e-e9a704a18c39', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-09 22:19:09', '2024-09-09 22:24:08'),
('6b09b6ae-d5c6-4ca2-8600-0405de162595', '3', 'Tenant Payment Rejected', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 09:37:01', '2024-08-07 09:16:23'),
('6c30ddf0-4fe5-4603-9842-ce46d2bc614b', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"d5ef2063-6870-4dda-bf3a-a1b6e7c18acd\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:53:59', '2024-09-09 22:24:08'),
('6d058bf1-8f5b-4b35-921b-2a56c35a59e5', '20', 'Tenant Payment Rejected', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 04:02:37', '2024-09-10 05:49:20'),
('6f9fbfda-6a7d-4145-9bc8-8faf54f8afa9', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"e13487eb-79f4-4605-9ee2-4fc28c706fb6\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-27 08:28:02', '2024-09-09 22:24:08'),
('718d3574-47cc-4156-a309-85d364c7fd64', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"a05d582a-e4cf-4281-86f6-cc1fbd6c9ea9\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 04:01:01', '2024-09-09 22:24:08'),
('728cf050-19bb-4817-b7b0-72406659e3de', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"eb30ce1d-385e-4570-995c-3b5468cb77fa\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:05:52', '2024-09-09 22:24:08'),
('73c8a974-3b4b-48cc-891b-b797cbd92d9e', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-16 21:40:04', '2024-09-09 22:24:08'),
('740d2548-bcfc-4551-9705-504a3f893892', '2', 'Tenant Payment Attached', '02 - 04', 0, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-13 04:25:23', '2024-09-13 04:25:23'),
('7634761c-35d1-4f91-9990-ab069ba4fa25', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:35:03', '2024-09-09 22:24:08'),
('785953fe-e3e8-4b66-825e-8503ee55def8', '20', 'Tenant Payment Rejected', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-10 04:43:36', '2024-09-10 05:49:20'),
('7d6c3261-93ec-4d09-900b-2fe13df931e3', '20', 'Tenant Payment Created', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-10 05:48:55', '2024-09-10 05:49:20'),
('7e2ef9ab-34cb-45ab-8d08-de8d4a8d35e8', '20', 'Tenant Payment Approved', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 21:47:33', '2024-09-10 05:49:20'),
('80cd91d1-2aa1-4744-af05-cadc46579653', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"dd7fd0c7-cdcb-4c3b-a275-f9a14f6c6ec0\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 00:15:51', '2024-09-09 22:24:08'),
('815c9898-ada1-4665-8175-5255a2e1d8a0', '3', 'Lease Expiration Warning (2 Days)', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 05:27:14', '2024-08-07 09:16:23'),
('81f0b207-2414-49be-9919-72388b7119a3', '37', 'Tenant Payment Created', 'B2 - 7', 1, 'f629c5ce-837a-486f-beff-db2ea60135bd', '2024-09-10 06:23:29', '2024-09-10 06:27:47'),
('830b4562-12f8-4b60-adaa-4a4dbf6a02d0', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"5b1e3f8a-31f7-4095-ab74-c6966201727e\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-27 09:04:26', '2024-09-09 22:24:08'),
('848042f2-11d5-46d3-905e-e20bed31b7f9', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"8985f9c5-0f32-41ce-a142-e87877ad3632\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:15:27', '2024-09-09 22:24:08'),
('8a92b52c-9486-4cd0-b394-838de4a47450', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"ee194f62-6fbb-4388-a512-46d0a8666d98\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:17:42', '2024-09-09 22:24:09'),
('8b1fef98-5e86-4802-9408-46b6c9dc115c', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"3f27ac28-0f13-45b4-9e95-439a692438e4\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:45:34', '2024-09-09 22:24:09'),
('8f338da7-a4f3-415c-abb4-a3dff91f692d', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"c9622b6c-66d4-4b65-9599-f0f5f6afa2a3\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:10:32', '2024-09-09 22:24:09'),
('90f6e5cd-3864-499a-9ebe-fac5d83665ab', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"ccb30a17-1a5a-42b5-9e42-3e40170a5089\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-30 21:45:58', '2024-09-09 22:24:09'),
('91f7f984-c50e-4330-aa74-da0d8455ebf4', '3', 'Tenant Payment Created', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 09:34:17', '2024-08-07 09:16:23'),
('92d971a0-fba6-4bac-be71-6a74103b8520', '2', 'Tenant Payment', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 01:07:21', '2024-09-09 22:24:09'),
('93333579-5f3a-4118-a1a8-f1f590dc289d', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"3bc4f8cb-e4da-4b14-88ad-a097fbeea462\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 09:02:07', '2024-09-09 22:24:09'),
('951892fa-dcc7-45d1-9b64-84f868e7e3cb', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"c54266f6-db73-4a6b-9a98-39fc3b45ab63\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 04:03:33', '2024-09-09 22:24:09'),
('95cdb088-83f9-48e8-b38b-942dde871149', '37', 'Tenant Payment Created', 'B2 - 7', 1, 'f629c5ce-837a-486f-beff-db2ea60135bd', '2024-09-10 06:22:09', '2024-09-10 06:27:47'),
('9799b67b-a90d-4ee1-842e-b43d520b0f88', '3', 'Payment Due Soon (2 Days)', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 09:10:24', '2024-08-07 09:16:23'),
('982939ca-d8cf-4503-95fc-4703155de4fe', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"1e73cbbd-6f15-4cd1-8168-a526786bd17a\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:28:40', '2024-09-09 22:24:09'),
('994c9c0f-a34b-475f-9f2a-2bbf601fde2d', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"8c42886f-153e-4d0e-8bdd-1e19d8b716ba\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 09:14:45', '2024-09-09 22:24:09'),
('9b6df0b3-3819-470c-9c86-75e6b0f988ef', '20', 'Tenant Payment Approved', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 21:31:43', '2024-09-10 05:49:20'),
('9bbfa042-eff7-4acc-b26e-79c67e94866c', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"fc19467e-1e88-40f0-977d-4a631d360974\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:22:38', '2024-09-09 22:24:09'),
('9c59120d-6f9c-44a0-85ba-be7c78bc264b', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"64a0b02b-967d-407e-bb91-3d3245438657\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 09:05:17', '2024-09-09 22:24:09'),
('a1b95e67-2ba3-4804-9194-31c124e5359f', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 09:15:14', '2024-09-09 22:24:09'),
('a2077285-2c7e-4b4c-a605-f8fc70b2f302', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"e32761df-e143-4ff4-9c27-0fece7fd94f0\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-16 20:48:31', '2024-09-09 22:24:09'),
('a29c132c-d447-4879-8fa0-8986a3cdf1d5', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-16 21:23:54', '2024-09-09 22:24:09'),
('a48d5b50-52d7-4015-bdc8-a5ba1eb86112', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"01f8be73-2cf5-4fa8-a15d-dd7d723d9b2b\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-30 23:54:48', '2024-09-09 22:24:09'),
('a5e1186e-1427-4fab-aab5-c193e9c54bdd', '20', 'Tenant Payment Rejected', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-09 22:21:47', '2024-09-10 05:49:20'),
('a7061256-d216-4575-8d02-4b100ecf6df7', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"cfac5626-d7cc-4a80-904c-9d7e82cec4bc\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 09:13:21', '2024-09-09 22:24:09'),
('a8025e39-369c-4e7c-a995-838601454250', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"5b6898f7-fc70-46c2-aa26-8b754f7fdbc4\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:15:59', '2024-09-09 22:24:09'),
('a8221c4f-e881-4fdd-8b72-561fa438adf1', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:35:26', '2024-09-09 22:24:09'),
('aa247793-d7ec-49f1-afd5-5930efd57f05', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"ff58914d-77de-4acd-a865-62269f8ca2b1\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:20:45', '2024-09-09 22:24:09'),
('ad6b2a96-d7b6-4b2b-b9bb-cb6141120700', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"6111ed90-81e3-428c-b99a-9b56b25e5ea3\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 07:57:30', '2024-09-09 22:24:09'),
('af6940ab-aa69-45a8-bee7-cfcc15e61888', '2', 'Tenant Payment Attached', 'G - 01', 0, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-13 04:09:48', '2024-09-13 04:09:48'),
('b0aafc02-a78c-475a-9475-ab9fe8552f4c', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"7d766ba8-a2f8-4951-97c6-9ca41b266020\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-30 23:22:24', '2024-09-09 22:24:09'),
('b0f72c37-5ecd-427e-a0c5-fda9e1a18570', '20', 'Lease Expiration Warning (1 Week)', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 03:55:42', '2024-09-10 05:49:21'),
('b73b5a0c-5ea0-42c4-a8e0-6590a4fbb1c7', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"791797e1-494c-4a67-95a0-cf11bf944e70\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-27 10:28:43', '2024-09-09 22:24:09'),
('b7f2921a-7ec9-41f3-a520-0fd5b5590a62', '3', 'Tenant Payment Rejected', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-07 04:02:24', '2024-08-07 09:16:23'),
('b8b673e9-1887-4f33-bca6-0c2c4184dfc2', '2', 'Tenant Payment', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 00:46:41', '2024-09-09 22:24:09'),
('b9705771-cd4a-4392-91a2-4bff625b0f87', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"951bad09-ae0a-4e39-a188-569acfba2594\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-30 22:08:47', '2024-09-09 22:24:09'),
('be67f012-c6e5-4257-9368-bd8528406844', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"b36d9437-f468-4552-8755-e75bb39034cc\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-30 23:23:05', '2024-09-09 22:24:10'),
('beb00931-16f0-43ef-9bbb-c3eb78538d55', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"18affa62-3a3f-4eb8-b5bb-e380676f2ae0\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 09:16:25', '2024-09-09 22:24:10'),
('c053a6fb-2bef-4c11-ac4d-8f68edeb65d5', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:35:39', '2024-09-09 22:24:10'),
('c4919f38-1f24-44d0-b1ed-516220b5e957', '20', 'Tenant Payment Approved', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-16 21:24:19', '2024-09-10 05:49:21'),
('c5074958-f4f1-47c2-8f77-481bed7f0676', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"8a71fc5f-ed06-4954-8788-dd4cd653100f\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 23:44:46', '2024-09-09 22:24:10'),
('c5f79f7e-538e-4647-8845-93fd521faff1', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-10 04:43:05', '2024-09-09 22:24:10'),
('cb34c476-b092-40b5-976b-d90f4e696ae8', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 10:13:10', '2024-09-09 22:24:10'),
('cc331804-ad6c-463e-bafd-7f237a513be5', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"7a225de1-ed9f-49b6-8d10-4ef1452e0d72\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 10:40:24', '2024-09-09 22:24:10'),
('cc6f2eb5-5647-4141-9aaa-3db750d21d45', '37', 'Tenant Payment Created', 'B2 - 7', 1, 'f629c5ce-837a-486f-beff-db2ea60135bd', '2024-09-10 06:27:00', '2024-09-10 06:27:47'),
('cc7dbc3f-1f0b-4e4d-aa79-4d09aee7abbe', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"8e112ec3-683e-45c3-bf65-dadb8bfa1d9c\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:10:02', '2024-09-09 22:24:10'),
('cd4f0e5f-3815-4b40-ba70-ec995ad4ec00', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"0333d9b5-f565-4005-ac79-33d9908c44b9\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:17:12', '2024-09-09 22:24:10'),
('cf420799-de6c-4df4-a8f0-3c048a618285', '20', 'Tenant Payment Created', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 22:58:33', '2024-09-10 05:49:21'),
('d11b438a-dcec-4684-aace-fcd64e68cefe', '3', 'Tenant Payment Approved', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-06 09:10:40', '2024-08-07 09:16:23'),
('d389fd6a-5cea-489d-a1b9-6a19c3fa0a29', '2', 'Tenant Payment Attached', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 04:02:03', '2024-09-09 22:24:10'),
('d52ef3ae-66c1-4c39-912f-80004475b3fd', '2', 'Tenant Payment Attached', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-09-09 22:08:16', '2024-09-09 22:24:10'),
('d6b4626c-c214-4819-b931-6f9907fcf20f', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"18fd983c-d87f-4215-9d68-97cb9011af2d\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:20:09', '2024-09-09 22:24:10'),
('d7304e7e-c9e4-403e-919d-5191c9ade28c', '20', 'Lease Expired', '1 - 002', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-16 20:23:20', '2024-09-10 05:49:21'),
('d8d5c4b7-7256-498d-ad3c-3baa1d4bd1aa', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"427421a9-8d01-4d2f-97c1-2d905d2729b1\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-27 10:27:47', '2024-09-09 22:24:10'),
('e1bf5f45-f4c2-477a-b1df-44bd2f56a347', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"91f1fb30-1d8b-41ee-a52d-6cfbb006def4\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:10:07', '2024-09-09 22:24:10'),
('e3585605-1f23-4077-a6b6-140b2ab457b4', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"bcbbb98a-5cea-4cb0-85c7-2b3f8af624a0\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-30 22:10:59', '2024-09-09 22:24:10'),
('e3e9d233-f9b0-465b-a46c-f78885fd695b', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"9a6d7188-8515-4718-b05c-26a205db79ef\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:26:35', '2024-09-09 22:24:10'),
('e72d0b90-1bf3-469e-901c-cf9ca5920785', '20', 'Tenant Payment Created', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-12 23:54:39', '2024-09-10 05:49:21'),
('e7d6ce46-8816-4e29-a70e-356cc6b3ce61', '2', 'Maintenance Request Created', '{\"notification_message\":\"G - 01\",\"request_id\":\"375b5764-a5a2-4065-8f26-355ec0c7df5e\"}', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-31 00:03:34', '2024-09-09 22:24:10'),
('e86173c8-a7c0-41c3-99e4-f2c5eab0df07', '20', 'Tenant Payment Approved', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 23:00:44', '2024-09-10 05:49:21'),
('efedc8d2-598e-492a-861a-8be3fd656cf0', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"9c3288d5-6130-4877-b861-e7d00dc7399a\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-10 03:59:58', '2024-09-09 22:24:10'),
('f1b47d44-686c-4d85-a25b-92db5296e2d6', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"1592011b-f2fe-4817-a7ba-bede6f85855d\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-08-08 10:11:16', '2024-09-09 22:24:10'),
('f2e888cc-52fe-4652-9013-0204ac4eef15', '20', 'Tenant Payment Created', 'G - 01', 1, 'b87ef2c9-4c5f-4441-abe7-eb336a3f1686', '2024-08-16 21:43:03', '2024-09-10 05:49:21'),
('f31c2dc6-85ff-4347-96e5-d618f0cc515b', '2', 'Maintenance Request Created', '{\"notification_message\":\"1 - 002\",\"request_id\":\"71ba5eac-8bc0-418a-9114-bb219e092dfd\"}', 1, '4ae79945-1181-4ff8-847c-e48069495cf1', '2024-09-09 22:10:05', '2024-09-09 22:24:10'),
('f9574e86-8b5f-4b93-9377-c1fb339b4454', '2', 'Tenant Payment Attached', '02 - 04', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-08-31 00:35:16', '2024-09-09 22:24:10'),
('fab37f4d-77cf-4d4b-90ea-57e9134cb44e', '2', 'Maintenance Request Created', '{\"notification_message\":\"02 - 04\",\"request_id\":\"7104f1b2-94ce-4b71-b421-d15f26da0dd8\"}', 1, '1b865cc0-4445-4446-ab1f-46ee739805eb', '2024-09-09 22:19:33', '2024-09-09 22:24:10');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL,
  `lease_id` char(36) NOT NULL,
  `number_of_months` varchar(255) NOT NULL,
  `start_month` varchar(255) NOT NULL,
  `end_month` varchar(255) DEFAULT NULL,
  `due_date` datetime NOT NULL,
  `paid_date` datetime DEFAULT NULL,
  `rent_fee` decimal(10,2) NOT NULL,
  `penalty_fee` decimal(10,2) DEFAULT NULL,
  `utility_fee` decimal(10,2) DEFAULT NULL,
  `other_fee` decimal(10,2) DEFAULT NULL,
  `invoice_number` varchar(255) DEFAULT NULL,
  `payment_method` text DEFAULT NULL,
  `bank_name` text DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `slip` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `lease_id`, `number_of_months`, `start_month`, `end_month`, `due_date`, `paid_date`, `rent_fee`, `penalty_fee`, `utility_fee`, `other_fee`, `invoice_number`, `payment_method`, `bank_name`, `remark`, `slip`, `status`, `created_at`, `updated_at`) VALUES
('0a3f9831-17df-48af-8d95-fe8a61fe6fe3', 'fa228eee-4e6d-4519-a17f-c92c3920d308', '1', '2024-08-09T21:00:00.000Z', NULL, '2024-08-19 18:00:00', '2024-08-17 02:00:00', 42250.00, 0.00, 0.00, 0.00, 'hjh', NULL, NULL, 'sdfghjkljhgfh gjkgjhgjh ggk g jhg jjgjhgjg jgjh kgj', 'invoice/1723860000_Invoice-1481.pdf', 'paid', '2024-08-10 04:42:29', '2024-08-16 23:00:44'),
('17737754-c08c-4852-8bc0-24498fc911d8', 'fa228eee-4e6d-4519-a17f-c92c3920d308', '1', '2024-05-16T21:00:00.000Z', NULL, '2024-08-22 21:00:00', '2024-08-17 00:44:08', 42250.00, 524.00, 359.00, 119.00, '125554kk', NULL, NULL, NULL, 'invoice/1723855448_Invoice-1481.pdf', 'paid', '2024-08-16 21:43:03', '2024-08-16 21:47:33'),
('29089f0b-6ff4-4798-9048-3a5f2294bb6b', '342a677b-9235-40c2-8080-55b91535b4e8', '1', '2024-10-16T21:00:00.000Z', NULL, '2024-08-21 21:00:00', '2024-08-17 00:23:54', 21600.00, 2500.00, 0.00, 0.00, 'rr', NULL, NULL, NULL, 'invoice/1723854234_Invoice-1481.pdf', 'paid', '2024-08-16 20:27:27', '2024-08-16 21:24:19'),
('3ad718a5-04e2-4eab-ba91-76ffd38b9901', '342a677b-9235-40c2-8080-55b91535b4e8', '1', '2024-01-09T21:00:00.000Z', NULL, '2024-09-09 21:00:00', '2024-09-13 07:17:59', 21600.00, 0.00, 0.00, 2222.00, 'cdss34222ff', NULL, 'Dashen Bank', NULL, 'invoice/1726211879_report.pdf', 'awaiting approval', '2024-09-10 05:48:53', '2024-09-13 04:17:59'),
('52abedac-1f2a-440e-9fe1-9b4dd942a983', '51419099-e543-412f-8fdc-9a49d18ab3b4', '1', '2024-08-09T21:00:00.000Z', NULL, '2024-08-27 21:00:00', '2024-08-17 00:40:04', 54000.00, 0.00, 0.00, 0.00, 'jh', NULL, NULL, NULL, 'invoice/1723855204_Invoice-1481.pdf', 'paid', '2024-08-10 04:41:19', '2024-08-16 21:40:19'),
('8021bab5-a1ec-4915-99b9-9823e1908bce', 'fa228eee-4e6d-4519-a17f-c92c3920d308', '1', '2024-11-16T21:00:00.000Z', NULL, '2024-08-18 21:00:00', '2024-09-13 07:09:42', 42250.00, 0.00, 0.00, 0.00, 'cdss34222ff', NULL, '20', NULL, 'invoice/1726211382_report.pdf', 'awaiting approval', '2024-08-16 22:58:33', '2024-09-13 04:09:42'),
('a4329107-0ec1-4674-9585-3b31b0d6244b', '342a677b-9235-40c2-8080-55b91535b4e8', '1', '2024-05-30T21:00:00.000Z', NULL, '2024-08-28 21:00:00', '2024-08-31 03:36:11', 21600.00, 0.00, 0.00, 0.00, 'cdss34222ff', NULL, NULL, NULL, 'invoice/1725075371_Invoice-1481.pdf', 'canceled', '2024-08-30 22:30:29', '2024-09-09 22:21:47'),
('d037b792-707d-4044-bd0c-2be3859391ca', '342a677b-9235-40c2-8080-55b91535b4e8', '1', '2024-02-28T21:00:00.000Z', NULL, '2024-08-29 21:00:00', '2024-09-13 07:25:23', 21600.00, 0.00, 0.00, 0.00, 'cdss34222ff', NULL, 'Dashen Bank', NULL, 'invoice/1726212323_report.pdf', 'awaiting approval', '2024-08-31 00:40:48', '2024-09-13 04:25:23');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission_user`
--

CREATE TABLE `permission_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'web', '2024-06-28 19:54:02', '2024-06-28 19:54:02'),
(2, 'user', 'web', '2024-06-28 19:54:02', '2024-06-28 19:54:02');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_user`
--

INSERT INTO `role_user` (`role_id`, `user_id`) VALUES
(2, 49),
(2, 50),
(1, 52),
(2, 53),
(2, 54),
(2, 55),
(2, 56),
(2, 57),
(2, 58),
(2, 60),
(2, 61),
(2, 64),
(2, 67),
(1, 1),
(1, 2),
(2, 3),
(2, 20),
(2, 22),
(2, 31),
(2, 47);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('03xjl0fA1yg41lQaX2VYbMiutnfFB2eZQEgP3RjN', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVWNEQVVWVmgwRmZoRkhPd3dWeE9hdG80Tm94bVNnUnpHYzgxazBERyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725020140),
('0oDihYbjQkIxbQTcgVbyUcI5puyzrGly4V2hPaVS', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHpXaW9xZWx4VlZUOTVuZFNZRW5jYUdIY3hYOE9kOENpMUY1MFp4eCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725067021),
('0YwhYZuANN8Ug5LGH8JIWWQSbv84kD6CSFeaHgph', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZnNpT3M4S255c2RLODFrSlc0c0xZVFFsaHNCMUZ2R2cxUzJmYmJkMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725008020),
('1uzNLXQC6erck0bGAXaFrJRGHlrPpR3UTtEJgiYj', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNzhnUHJBbjVEaVV3dGxhckZwUXBNb0RjQTZ5WXhyZ25OTGZTeFVBUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847406),
('21Hqhir0Z3KkR5g2jUJRXhPHrWO6dhlIuAPAziuY', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGdJR0ljbnlLRWtjUkZoNng3WFQxTnZTMWo4OWY3MTB1WFdlQXdMayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725018400),
('298WxTA5xl0erb7XfxeZaeBmSviPB8SD09IzD4c8', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUElJUGxPQkZaUGltQ01WVlVyVXhIWXJSYkxuMjBBY2ZCVE5vRGFIcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725067785),
('2JPBWSos7R06iYrQYPwjwjq20kijr3HUr5yswClb', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicXNWNk1ZbnJmNlVNMVRUVDVhNWVJRUs0SWh1a3FsQ21sdjUyNktqNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725016488),
('2VCrjdLKDOb0w4n9ywDLHTqa2wEKOZaB9iDgMmhc', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1FCaW1mWFRvS2UxelMxbUV4M0xRWVY5ZFJuY3NwS1FEUlNCem4xQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724845942),
('31KQOO5pn5jhvst6BIMmKsPGQzfQbwILW6Au9PRU', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibE5NU3BoclB3TVNYemV5ZHNlTDBGZ0ZrSENzUmd3Z05WZGpsNXdGUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725016459),
('3gm5jaiQ5ACrC2udoYnVvbK5HzJnfTxDUZH8Scsx', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU242emRMVDhlRVJVaThjMHBvdHl1YWtHU1pTeVRNTDQzUHBTSXBQSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848895),
('4DSFhrZSbnLWRQHgUGPEHax1uD9Oe1vrz0223dNj', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMG5RNERPOVEydnJSYWV4d2FSWjFPWnlxbTZvYzRKcWIydGl5YmhNWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724899904),
('5GN471RIKWLX5PQWNEfsFl4uo7yZgbMx3ZvtT2BN', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUw3cUpLUENnZnZRWWR6QkdCRWdFUTljRTJiRzU2ZkZNc2RySGVXbSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725075371),
('6QSKFnBEIePkame7tU4N5g7hv7kB55lpllq1WoXH', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT3ZsQUpiUkNteDV5OXhaeEphamt4RVo1bzRraTZCeHdTM2kzT1VWOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004635),
('6TB9ISn0TBWmudpLnGPFsLyDaYzV42CiIvQUwocS', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDh3YmhrU3hVOWJLbGlDV1dWZWNVZkRpRjlJSE5qSG1VNlZtdDE5TyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725957166),
('70mMEe0dWNa1Y7Us3ks6r6nQa4Ml7BLwFesPlY1Q', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYTNQTVR5RUJoR0hJZHdCT21kSjQ5VDBpTkN2TDBFa0QyMHFJaTFaMyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900088),
('7dfutGZLFpfTTSNjQdWoLbGp7AqyhhTPW1odiLvR', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidk5yWlFVOXJ6RmoxcHhmcGZaeHN2U2JsVUlCUm01QWg1d2s1SkR6VSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844962),
('7N0YzW9PIlW62ANCzDSp0bL4m3yqqUtga5ZpQfUJ', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNU1kbXpHTTdjVUpFaWYyelZTYmtjWnVFanVoSUV6T0tMMzJEVXpLdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725958317),
('8A1EdIXslhZ3yWqzXlp29gapx3i3HENIMsSypUYi', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVVVZU5yOFl0N3J0Skt1VmFCc0tnVUlxNnRrZVJwUDVaMDh0ZU54eiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004545),
('8HlqurAcaoQNSzHCZzcHLCOXI3RWYOEv6ZHN4N3q', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiektGTjVSV3I4Y2l6U1hmQ0Q4bVBsV0tGY0JkUUxIR3I2YTBpZHJvdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847680),
('8SQb5HQ98sQwyWhGPuqyzh3GdOvnmd63bWFE4neb', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUWt4WkRLeDFlOFpqWjdac0kwQ1BIZTE5Z2dqYjRuUkpFSGhLQ1dzViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900857),
('9f3gbzNZWi1vLgQU3XHO9f7VOIh4jPloPHXwQ0Xj', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidkw4T09YM2NMY05IVm9BcDhyTmtrRU13MWdLdThjaTNiY3pHTTl1SSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848013),
('9lNdHHMk8A2w3DlC88z2rEF9yzgbuhNBJrffxb4K', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS003RlQ0SEc3OVBrd2ZHbk9pSGFMbDZrMnZEUWZKVHNEUVNBSGxEcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004438),
('aD0jLo01rUmNjuWPBszFtMLjGIAbUTY5GX6Xuug6', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNndjZWZZNVYwVVFEaDh4SDJzU2IzNGZjVk9XVTIzdEQ0ZHBkdW5xbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725067371),
('AOm49sroIA5QO5lM8YDz90nzkIaaqpODk1StpzIo', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmF0SUdKOXl1cnI5MXhLT1l6bVlFazhMNGU5NjhvYXlON3U4ZXI0bSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848244),
('AuBg6aED0b5zMGfoK4A1vEjzEjH0ayTR3JOKw7iq', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSG9FR21wTU1IRmN3NWhwalZielgyMjQ4NnN2aGlpSHpHY0NreGVQUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725959972),
('B4yUqcJj3uaCngmhDUh2R6T0bXpoO6xrvoC1tgwo', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicW40cTFHSkJ4T2t2eWRxaEEwbENXVVZiVFNMTEptcGNsSHA5cWNsUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848313),
('B9MAeLj9PmTuVIvApBPsrAoHLA32gSrzk34VsmeH', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVkV0UldPa1RCOGJTb2FvUzMzVXBYTEI1UlZYOFZnTE1FSUFrNDZ2MSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725951806),
('bcbHmsSlOWnAIRBDSLn3rSzPg0KBQpt2Ii6R8hXz', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVnYzd1A1MUxnaDFJbEtNaFp3S2lRVFZtajFjWEJFcDVUWE93d1BNcCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724842585),
('Bddw8FGDMmJg7qWkRGWgWLePU7vZpHUzzExgnbne', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2tiWGZhcmJHVm5LS2NIbzNibDJrUzJBMWxzSENIVFhGckNpYXI4NSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725015761),
('bTYBkF2sxuiAK8X3Yqc2hfbjU0uX49XjZJaImpXV', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR2M2N2FOcjY0TWJQc1JVZXFSTjY3ZllONHJkS1VOREhYbTZ5a0FTRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004703),
('BxdrRpjFd2wZK9HDyvvJwqXimKeMZVO2d7RwQikO', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFRucDBycXR0NE05NTFQNEV3dXBNSlZBV1lmU01tTFNNUDFlTVY3SCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725954320),
('c2P8LGvk4UD2yEIp9Q2BSFnMEkn7OPG6Djm8Ymjm', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkRrOWNiRFZrR2xjbWxuVXhWQlQyZm9qcGJtb2pjZnJyT08waHV1QyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725956884),
('C7ItZ9WM3lmmpsUwSIFDlJEdnJxRN3YwgBB2TzRj', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVFBxSUNOUjMyV1JkNFAxT2hoZUZlVHoyZGtiQjR5VnZNbDF6SzhXaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725960363),
('chg4VNp63Ei2oEOIBfGVkc9jvfdmtmku2mFH1KpW', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFg1QkplY2hBckl2VWpiaWtsRFoxQ1FoQ3owbTluVXVkSnV1SUM3NCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725954751),
('CLD6tXE5rPBcdYYS7vD8gwyZkPGWOZ52iCfFT32x', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0t1N205TjJYVXBiRjJPWlJRVW5zRW5PZDc2V3JpOWJwRGRtRkdMWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725008609),
('DcRxnk42UTjHhYk5xovrt9IXWsSSsvj8ikaKXekL', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWpkelQ5QUNQa2N0YjVvb1ZjOUg2SERUaVJWRTlOSTY2ckdyOXVVTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725020190),
('DHc36LXuzOFo4UzsPgzpcb39XckIjYV9vRmt4YrW', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiajdjcTBMN1BKWkhlZFd1UGhaUWdLTmhybW03TDdhT0xvMzNRNUlmRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725954770),
('e6v8zKoTEZQXwmPzdFBR6dSBfbyCMBrXvwuUN4OV', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2J3SmttUXNlaFI3akVQSTZGMlBlcjR6bk01bUZ1WE5ZM3VPUTgwOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725976095),
('ec6EO9vRDdEccLucIZrfsuXtvACExe7ISU0cB41j', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoielZSN1lHTGdsSVZwZmFhRmJpeVpoOUNVdFFPTFlsTDlOZURMMjVNTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843493),
('eFYOCzOw9TsCXjOGIvTwgdpzV9nQ8VWMGMPIzvFR', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVJ3NnVnUVdiYjVrTVZKYjQ1SE9DZ25JS1B2QjRUakQ2Y25mY1dKTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725015713),
('ehhnPor9FKtEhvFy13NC2QDNko2uE8PROicQrV2o', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTFRxaEZaRk5KUnp0OFJnS2xpcHYxNU0wTjg5NFpGbHpYZ0p0YkRydyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848067),
('ENdbt1s5Qx2Nf1lUqA5b2FPbPuP0Tk6YEjjiQ0zl', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVHU4dWhKNlc0Qk9ZblMxSHdhZzUyRDBoNmhrSkFrcllQMmpLNG1HdyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725959581),
('er7KXGrbR88CO6HuejwUFhJnPCnPSeAYnEavXa5v', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUkxna3BRT0I3WTZpQ29oYWJTaFlIenFvQWxwRE9ESjZ5RFAzUWR1ViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004428),
('eRPr1qDuBx19npwHedcBopEiAexGsLrpyOqUkHN6', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiekp4Z0dVZzZJN1d6aHJkNDJLSzBSdUZFczR6d0l2Nm9CeThYQ1h3diI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725675802),
('eYr6SJoIqDH3iMlQNromCxst5CkifBRc4wfqtqWs', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0JwZDc4Y2pBelpQYTdkQ3BrZTRqYUdVcW1PMG1rb2JSTHd6b2RoVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900722),
('fanaBNjm36iegFOB9S1oHD0PxheY9fBN0mT5hlnH', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiakhQMDZDcG1yVEJ0QUJNeHM5Vk9WdmVjTUFoTTFsY0NaN1FFODZ4ZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844242),
('fbK3MRI4LwRb6AbQ0ZCrPnQl4gxO4650Pnnz9Wdg', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidTJuREpxWGxBM3kwM21xRHRCRGw0UG9YR05ET1dsbjVVVDcxYTIzZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725008532),
('FbZbTkU6LvHxseCoT759SC63Z5ECBJNb3a5rl1Fk', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQVlsM1k2TGNYUE9FSGkxZFFZbmQwWnpxbjlKbWM2NmpDSTNTNVBubyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725007173),
('FdNuYTo9NjpFDugH94mXCu7i4hUveXeEiOyOlg0G', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMXA4NnBpckhWNjh4VDhKcjM1Y3ZZS1NBcFlHY2NBb3VIa2RQRzNUQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1726206204),
('FJ7HMDFPxC4C0v10Xs3GBYts9u1mIxBt3ydQteHS', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSE9iRW5ZZUo2S1VYQXJzbFJpYnZ6Q09Kb1Yxc2pkeU5MTHA4SWc1TCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725958251),
('fKKuxdwmgn8xdlUBm0TDyzKvAK0RDdcOtIJTcVGe', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSk5Bd3d1QW1MSW5wdEhGZ3k4d2E2SlhXZ2ZOZ0dOZ3lZY0JzMkVOTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848686),
('fOy3ogqcsCgps2o3cXhEZEm3cFvHqH1Ez49vT6NA', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid1g0ZDlaU2pzb3d5aHRSTUE0T2Z3QzlTVnRhMTNCUzJESFdyS2tvbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725015692),
('gBbO0mifRVQpgfpAQpUXf5SzRNrWyNUCHXuXVrnO', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWm9DMThMbTZNY0NXbEFvcUkzNGhrUk53VHBLeXIybjJROEpCQm9IciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725065258),
('giIbjBKhyNtNviGQe609Ib3UNKDOO2o4dQHTrap2', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2prZk4wTDNFa3dVcmFidVFSeVhJdDMzaEtHNzJPM2NDVEd1eVJjZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004824),
('GqnpT3pE6ZJvYvthonYB2pccy9M5TQxkONWcgIxy', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV0Y3S3ZBdEF3UHlsOTlkNUtMUEVWcnJVNGI0RW81M0UyempPRU5HZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724932640),
('GVx7S5YVcKxxnDGV9JMuUtrmL2XuJr1gVaXNOVaT', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidHN1cFNydHlNWWoyM2wwbVBSNUt3VVljT3NnZHRMMVE4R3JNMEk4MiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725075260),
('GW9CcJwCUwQLAxKKkpPXseUonHQ7HfUoGEexnWgn', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY3c5NDN1V01telpDWHVzSVp5ZGY1RVlUcXVFZlYyd0lQN3Y1SnN4eSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847979),
('gWDeMisc9lCrXdn9RcbZ5WDSHAVoIju7MCuJ7HYp', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibEZCSVJmemc1RjVPWG02ajZTVkRqYkZvc3I0amNOSFJuMTBkb0Q2MSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725975941),
('gZqoQkVJXugxECYaywlv1eyXExEaP4MUlkgUSWmB', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVU5oU1hlb09rUEczcnE0N3lZbmFnZHY2UGlkbWcwQlJHYk1saks4NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725019279),
('HKZjuYtL6PYltaBVM0hTefpAH10cdQyVt6SuiLcn', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUVZnODBRYlF4dWI3SVRwTGxiWGZrQnV4eWRaaXM5aVc5bVBSdXJvRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725976313),
('HtFwL6MUQIjtH9YUwfuTUqY396jbvzYk1D5tXdmJ', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiajU5WlFzR3FHd1VNY2VJQmszRUw1RWdhMlh1UUZkNzF5VVBCbmVJTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725072881),
('HuF6sllelNAc6e9NaIUavev966CAZSaOnuUhfOKo', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2g2SWxISHlBRlFkZm1ab1ZFVTVyam9Mdm1nY2ozdXM0SThtdmFvaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725005132),
('IHp7ZSODxb0iacngdfpXLntJ7xScgB0WCUsy3olr', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFJzUzZFMEdIS1ZTT3o3Zm5DWk84blEyNzBsdlBnYkkwQnppOHJiOCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900843),
('IMGOyLfR3bN1VEw5snXbWa6PP9d7TbRouGXUt8jO', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieW9QekRSeDd4SFJOYXFhQ3ZUdnZBZERNcTRTSmNzQWt6ZnJrcmdzbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724899964),
('J4BpWfuHDFW8CBGIQSBepjVmenrLWC1A0TMJVmP4', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2lndDhhUDU4cVA5UDJ1R2tEczNVbDBDT3NaaDNIcE9sc3dubnh3MiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724898971),
('JM1RfCYiQEkfstPVOWQ9H99mQF1kxriEw2yMuVBl', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYlNXQWQxMTBJcWdvVlZPU2paV25aeVFQM1RDclFUN1dqRXpiM2ZBbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724845906),
('JMG3ZmBJRI59vduzGvx7RHBZJnp6gGpYU5N11ifT', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQlN2QUhOS2JQaEx5OXJ5clVnMVp3ZmhTUXpWdHgxcm5rZTFWYktPViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724897457),
('JZ2UhLemqMkZYQjmgNz3z2F84ukENbHr6s488TUZ', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVVphcHNwdDMydjVDMnRiTVZuWlVDVW9iZVA5azVWYTA1MnkxSk11VSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725015573),
('K2iYH9SsfF7ZRkCcJwEyrixQI0CtUFqRbVerpMDX', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1pYTUtWRDdWdDdtV3J4MVBYRmJnYUsyWkJaT2RyNlc3MWFuMFRsVCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725675575),
('KGIdtMDGi6HupPgt7b91dpzXAZNGJAaFGIqByyJK', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWlExZXlHTEttUlFCTGkzc3diTWd2UTBWdktHaEtoaFVIVHZaUkQ0UiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900063),
('kOztWh9Pxwu1hj2MiFEiV5QpW3hk2LHhs0hazG4M', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0tEeDg1dENVQXhnTVB6OGs4clhYSVZjSTFhSmE3ZjFKc0hNNzhEYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724898354),
('KS1V4ctU3Z5RZFSNWJEPA5dtcG6YYszp0blwJ0yF', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmVyejZiWlRMdVkzUUVDaXV2RDR0ZUFxcnl6bjI5ZGpjdmpZcDJyQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724845178),
('KTBjwRW3RMVas3goKROwruhhVmRAJgpmNm7rxIwM', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZW1KaEY5U3pZOTVLS2NFUHVqQXU5MDJDMlZrYVdsbjFuZE5BN0xUMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1726205829),
('L2UtwM68WPMgJfWO62ZV6LNzzO2IuT4PxoW6ssXd', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWDRzZE9CMnprMkdGcEFEeXdtbUs3Q2NnU2o2eVhQbjNadEhkUzZGTCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724901035),
('L9TGFDx8wOwhN3FCJYibREpfYfO2EwNnW44XvIpy', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiY2lVQ3oxenRGenFaOFFMU1ljczJiWjJhSmhWa1U4MnBBQ1ZoWVVuUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725678662),
('LaE8x288dtkUBc8fhgVwnyy0A6eda3cdg3Pgkedd', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWmlnazM5QUJsYVFBTjVpY1R3ZVNvalRSQk54c1lqR3dOZXhjanVKdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724842323),
('lCABmHdUjQkAQZCrwqf9oMCLo2pDg9E3scRMSj3r', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidnlSc2NZTEd0MDNPa0Y2ZUY2R2tDN3ozZTdTY2xXbVV0SWtIMFBpSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725017074),
('lOF9L18SRHopnrxWaR8Q8aK42Xc5T6Qa4c6wLwaw', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDIwTjhadzBtZUIxWFhSeGtyanVTSXFwMlRKTjNtSE5qN0ZFYzdIRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847556),
('lpcZH6GgFr3ordnngFab46apvgG9R2YwVM9Tiqhz', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUI3REFNcnA0bU04VVQ1TnduV2xFSlpKYkRFaVhDZmIyRFZPZWZkYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900030),
('LTyHpGZHzhPpmytMGUjfHmWXjHJUO8x6EeXEU3BN', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFhCcnhTUXBZeldoNDBNOWVNa1BlTTZFV2FwMWZMVlVTcmswVEU0NiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725954666),
('lwAgjdD8vS8NtsYGvrw3AmNktx7NfK2vAAVZLW9r', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUDJ4V1hHbExHSFE0MlBLUFBmVGdsZGVTYlhTMTBtcDBLTmNST3YxNiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724842682),
('ma3jbXkquHqAqerdHg9uO9bpaPIb8i6UOkcVCEiI', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRWN3OHYyT3ZzRkhrZWxqU3I0U2JVT1JYZ3JsYnp6RndpbVRJZDJ5dyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725019431),
('mAg2m2TaxXTMRWglrp7eFi3tf4nvPPJZGecrtZKB', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUdxS3JuaEc2NU9Rb0Y5YVBjYm54cDZpNkE1UHdJcnVYd29GV0VBaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724899112),
('MOe4m0La2XgpPKcjDL2nsoDUuopE5va5wu7uq401', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieElITklra2VNb3hXVnVKT3hBVWZhVWVVVVNFb1pNWnVFMTVucmhiVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848849),
('nfCDSW7d6On4pi1ACuDDagLMSwjUjOujw3FviZDb', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR2JaYmpKUDVTVjVVZWtLYXk3TmhkcDdScjNFSzEwaWRrZFhDeHg0aSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725956864),
('nooYmGezi9ZQrAX9vouiR8K0vRgl37lWhiZDhFiK', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWTduODVOc2tFcHgxRFlIYVF0S1dGWFhPbWJHYUF1N09SdUtFY0d4ayI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844675),
('Nv5T7ArvnNR5xlSakV0rn0gM6KJZUpTLmwbg4GGS', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTWRhWUtmTXh3bUxsY3FmQnNsdkdEUVVoNTlyT2ltNjRXeklINlQyTyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725016592),
('NzZQypI4qJUHKo5lxfFZLSNMP7DX8SPOmqXUb9Da', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMjRXa0dzc0FFS0tZdlpSellHejFCVE9BblJHckVUc1dQUGJ1d2dGcyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724842764),
('OEcbFAj28mA7OwBjsDuJoCSiUY6r8yyGYvMhjo6q', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWtJTUdISDF2T1luaWxYRWNCWUc4QU1XeXBYd2h6MHB0clRDZmZ0WSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848635),
('oLtv6eZo5itB8bjzrMZCujRsPJVs74ZcUq7RM1JR', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYjFSREdMUDVOSGQ5eEE3TzU2ZkplSFFmZlRDWnlERWpnc3pGUjBiSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844979),
('oPXQ4hzykiJ9SN9bGIteu517RWSVb7pg3H3LdH7k', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFVweENOdDFHYnkzT29oRmFiWWRlenZua05uMUZ6RHdBczBFMXNxRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843278),
('OzxcP3Md3km302YkavQ9vlsdXgapBO13icooUBnt', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2RmWHF6OTlUbjE5Tjl1dkxSYTNFU0hFV0YySnFRQVNSZHpzMkZJdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725020091),
('PClKFz01UPlCy8NEtuXt6DZlcDXbRtGke3hgSKX1', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUZ5TU96aXhUTEUxMkFkWERlNXVFQ0kwNHRwZUx2SndwRFlvekdHdCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725004422),
('pJgwWizzU0vuMfpeBK31pePaaOcSM2VVqNKtdikR', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRkt1MEcxbm1RZXdNUUtMUlV6TWtUNnJyV05ZazE4S2FrMDFtYUIyRyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848180),
('pm9oNRHE20wll36jIK1b0apXT0GL4u9rh5vvlHXI', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidDI4UU1DWHZNaTZIdXg5UlJNbnhneEJnbVN3MlZsQzJiVWxJR3dTcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725976109),
('pMveuVOcihMVYOmEZRiHbVV46s8uYPrzY74ERaYT', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicDJlaXJ3T0tmd2RZVTZyd0FLMkVtTUxaTmZ5SGZWa3NXMUQySjBJTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725007139),
('pW4vxXtJIb6XjDFIyTfR2JfyUkcfvvSTQ3lW2ZYX', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRzE1SXB3TWJyZERZcWxWenRMRGlqV2t0S0FERzFYdHliMFlPU1BmYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844311),
('Q2vYOmpnL60AGk2Y2p0JzkSnYV2CqiZJxkVrY7je', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQXpaQk5sNzZpOVlDS25TSjNJVk85VExJYTlRb0FVRzBySXpjVjdBaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724899086),
('qCx1LKE7fLBXZE7QBbElBzKRtGk57lC762dH7csw', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTEM0d2g4dmRxNWQ3UWpwY0QxSGVMWTZEYTlIYTRhRkY4VWZCamFwZCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847667),
('qIjPFtDcF715tBx4MveAJ7dcqAH9VWRdGvuTNTyj', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWU5VWUI3NmRKSkd5cmJ2ZzV0dGNCTHFUUGtNWFN6SkJtc2hrQzZOTSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847113),
('Qpk8zW23zOCkDXHcoZw9cQdGOIZRAxRcuFq7GOb4', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT21HeU85R1JjNXhvd0tMd0RSTnFvWDdyNnZUalc4MUpmVmlRRG1FYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843406),
('qPu6L4pPDXE062zaU7l9Es84IQ6AMH6KdATX94Nj', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOTBvYW5JeGRQQ2h2bkVJVFhjbXhITnVPMU16clFXbGcwSU8xNDRlaCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848775),
('RdpOw4O2atsyXqdmjVMQkispyus5u9U0eyvgvj2k', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOXFuVjd3QTFnSzV5bTNkaEhrTUM0QTBLWFUzT3dRNHRhYUJGUVNEVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725975914),
('rHjT7tEwA3YLjKLC8uI2QX91Oz129Y2RAQTbLTTq', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFVlZ2w1SEM4ZUthUW84bXNCMnk3Y0tMbkZRczE0SXd4NjJtempORyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724842494),
('rRb5LXVSEvkCGBayhjn5TeMExT4xSOxPOufaJKGn', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWTZ4cUpJWUxwbHpYNDA5dHZWMVRERzlCY1pha0Q2bWMxNkJNYmY2dSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725976013),
('rt9GVJMkGwdzhuyAB71XzoTC17HsrDoXNqXkNHRO', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3hDUklDeWdIMEhnWm1nOVU0c0RyMTVLOTR1dXk5dUNCaHNPbmtBViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843416),
('RYu0jTEiYD2eINdm75ftEKpDyijisXfzeT4hy9xT', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkdVamcyS2EwaHh5OEN6WGh1bkNEUUFmMjRRYWk0dGtqM2phbE15YiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725065202),
('sWnAAuKtt1tgQQHT4kblx5Uqo0u5YyAw7lpp3xAy', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTdHbFhseVlLM25LMEhKdzRWekhnRlN0a0tMbFR6Z1B1V0VneURONCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724846240),
('T6HbgOeGnRBTxS9g26G9PvWAAgj437NVE6i8f7RC', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFpJYlY3dFJpUkg0YWNnbVVSUlZpWGptRElLYnY0UEJOYjl2b01FMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725020018),
('ta0hQO8BsmJ8oJv6tMMYRLhOo77PiFSOg3qbzmQs', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOU91am1ZMk92MXFEa2I0U3VoOEZoR0RENWpSa2dpalRPV013VjM3WSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724897975),
('tbhpOLI1OvMTyEUrvuOqQLDviZae1uUcyme4zyuI', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia2RlVlB0NXVGWlFhYU9VWk00ekVNN2lCRW5tdkVsOVNtd1dDZm5QaiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844689),
('tdMoeAkfzMi5kzrQBCCLzqPxCxpI8hjjqHYaSI1C', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYWI5RXlVNVNyREtIV3NNNXlKMzE4WThnZDdrQ29XZVlZdXgzbU1LRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725958947),
('tfCVCCjNlIDaZ1RDCpCykHMlBF2LNxLamRvLaZIb', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZlY5QlJnM1RvRFZ4M0xqSlJ0MFVCMUN2NFFLcG1PaTBxTUpNMHZITCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844637),
('tgPWspXtAiHnTF6ygOhgJW4xAaMqU6YMyVOlr3qe', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRjIycVpoMDdxeUQ4NTVuTVQ3UktNVEtyMjI0cFhSZjY2ZmJTdDlWbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724846223),
('tKVVbFsctkPCIoGFI6JAJao4BLzcRruLbWWjdfJf', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieDdJNGpXWDhnU29yYlYxNjdtaGhKdW41QUQ3T3c5MGUzdWJ3TFpHZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724844268),
('TSoPUQrbX2icAQ55kxEfP4QfbATETCrib6i1iEnY', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZGhaanRzVWphSGlmb0hjRkN4Z29oUjR4ZHNQc1F4TTFDbFJ4RkFTViI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725067914),
('TsxlLJJmhzPvc5WuN5bt2KFEtOcdw8AIOovJGgJs', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2ZmVElyWG9WSWtHY2VmaGhHN1FYdUlLbGlDSHpYb2pTSUo2Qk45QiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1726203369),
('tUD69Uu79346u2xz08WLPrkkfThVkI9fSH1t7dAQ', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSnFVM2Q4UEtVVUkxaERpQ3M4ZVlGSHBtRUdNeGJvVTJ2VVVsdEo2QyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724847779),
('u3xWhh4YKOAfaUUewhhgdE7vASbo6BctUbMkPAPQ', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidEdBQm9aUU1CWDU5ekxxSUE2VTNxMGcyN1VQb0J3T0ZrSEFOaUN6biI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725958211),
('uJ9rsM4wphfTtSg9TMIM3QubNx7a135IzMyISv4j', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieWx0Qm1JRmUwQnpLV2o4OGg5WWJObjB2YVVWcXhMcHVCZXNJcDloWSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725960275),
('uknGQ3hC93f5eq2ddyNlgnjDzJzwljEJftneItEX', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaWJoYzVpMjBaemFYNFBXMDZSdjk3U0c3cDQxNUI3alJ3VjVEbVF4UiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725017764),
('UKPJB5mvNmgrM8rAj3iUh9XT5A2zXDWC9ePfzO4i', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS21rZEVmUUp4dkQ0WGI2bWNzVEpDekpCclhSTXlRZnNzeThibElLOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725066627),
('UXLBPWfN7tWMKAibTZ2aWsvVebVox4NeAu1w4yTW', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiR3FLZkh0M3VaNTdKQWpmNHRNdE10cVZBZ2FJQnQyanNxUFZoaVAxciI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724896658),
('v80lzzVbDJAnxo6RJaK5C2f4uXcdL76DM63j1kmC', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiREFFZWdyTVFvd0N6SzI1SGlvQmhaeWRPcXJsV1pDenU4Y29nMTZ1WiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725075225),
('VNOgB7FOZFrkelnYyCw8wmOR2XyvZio7FboUb7Fb', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUmFhTW9NUzJHSDFjY0FlVnZQVDZIelpKMUkwblFOcUdpbVN2RHpOZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725953783),
('VP6IORxogikN9BbwIiLgYANZm0D7wMlRDSotbNHB', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFFHY0F3c05SdVZyc2gyYlhleUlydGFXc0Y0YjIwZ3hWSGs0ajdSZyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725018661),
('VVvM7XVdhFGyxOZMld5QBOea3uSqSrfjjcuBHMHL', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOUV1Z0I2elp4MHNHd0ZJbVZCcmtMTVpaZHliaXozVEM2Nms4OE9ZZiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725067921),
('WChmHd25QgrYmaXzD6LHzthKQtMvLkLsa24lQKjq', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2xieWFaQlJzZW9wTVhQSmpWbzVhUGRaUk5uMWE3dnFqRU5Ma3ZvYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843297),
('wTYR7BDWOdCUGn6ngMtCKHdKUlHkre4BgcvYqUOz', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibDg5SXRONnRTMFNhdnQ5c0dleGllNjRmZE0zTjlVQlVyNGprR1Y2QyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724900388),
('WvVu19rev2oHc5BDf8gwHAqERHL39gFtEFLgy74v', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM0ZpVklhUmRWeUFPa0FlZGl1aXp6ZU83dWVkOE5IU28zV2ZEUzRyUyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843460),
('X4OwYmM85oh8Xiw6nlDB3jnL9Vn3jnhGzvMHn5xC', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWUpjQ0d5dzBJWDlQMUNCbW9aVHltR2pPaVplV0hUV2l0VHF5QlZIZSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725974661),
('Y14CU2tTG0T4m2CpJ6MaB1dGqZ7343m0kvy4jB5N', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1F5RWN2MzJQZ1FPa2p2WW5ZZktZOGtTVDVDeTNrVjJ6MEpUM1VZYyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724933568),
('Y1C9btYa0HsK63obkdSK0yohwIgSiO67Yfv5eoCM', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRDU0RWw5cXY4M2lwQnZtNWtxZkJId0p2OUpjZlVyZkN2a2h4VlJxaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848235),
('yCd6k33VviMs5LXCmaoikMt54pMYhTibrsPMtP1f', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVVdjSDZtd2JSakZrdUpoeFAxcUhWYWNjWndXTjI3TUdYNFR4dFQ0NSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724842269),
('YnVzFeenu2vTSRsI28iCqseJFIb0ZppVStog61Vt', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2hWTXZXUlluQjNaeDA0NHJleWRZT2t2MUVkQldjcEk0RVl0TElZWiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725684853),
('yO0jFQHDRvfqzBK800wysSyRcwLXPE4sgwIfw48s', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYzVIVlJVcXpQeDNHT1UxWWRTNFc4MEJjVFBidGlQcFd2amd3VzlTYSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724848943),
('Yv703nT9ZwHXr60gfHSu3YmtKv2RVkHKmtJDWPs4', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicGJNNzU0WVlzR0ZFNkZVaVJGOVZvbzBnbjRtSm9hSFU3bXoyNmRxbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1724843747),
('zAxUA2U8ena52WY83tm2M7pZhhmiFbCbJksWrUYp', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV2NveVhKTnE5Zjd6V0V2OWZsY3R1eTJQNEtnM3Q5NW5qZ09xSHU1QiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725960386),
('zohWXxIcoin3jVCxcyItTQFWYBKlsDcujJaIekMd', NULL, NULL, '', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN3pjUGJxRDJYS0QxVXJJYXByd0dVN0swdUZwNVV5ZXZkb1E3YmQxbiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6ODoiaHR0cDovLzoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1725017654);

-- --------------------------------------------------------

--
-- Table structure for table `sms`
--

CREATE TABLE `sms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sms`
--

INSERT INTO `sms` (`id`, `phone_number`, `message`, `status`, `sent_at`, `created_at`, `updated_at`) VALUES
(1, '0941797565', 'Your password is: 149fqh. Please do not share this message with others.', 'pending', NULL, '2024-09-10 04:45:52', '2024-09-10 04:45:52'),
(2, '+251941797541', 'Your password is: 3o4up1. Please do not share this message with others.', 'pending', NULL, '2024-09-10 05:29:48', '2024-09-10 05:29:48'),
(3, '+251941797541', 'Your password is: didv8e. Please do not share this message with others.', 'pending', NULL, '2024-09-10 06:13:52', '2024-09-10 06:13:52'),
(4, '+251941797541', 'Hello, your username is Alif11 and your password is 0xp0ca for your SkyBMS account. Please do not share this message with others.', 'pending', NULL, '2024-09-10 10:52:31', '2024-09-10 10:52:31');

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `id` char(36) NOT NULL,
  `business_id` char(36) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`id`, `business_id`, `created_at`, `updated_at`) VALUES
('a6dbeabb-f7c1-4928-944e-e6cb887ff433', '58fc542e-6857-465e-9f38-c54801d85bcf', '2024-08-10 03:33:29', '2024-08-10 03:33:29'),
('dcf5c8a5-2309-44a8-954d-ed0b08e3f6c0', 'e4fd4e1f-b90c-4660-8985-47874b408a8d', '2024-08-11 04:06:53', '2024-08-11 04:06:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `unhashed_password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `current_team_id` bigint(20) UNSIGNED DEFAULT NULL,
  `profile_photo_path` varchar(2048) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `full_name`, `email`, `user_name`, `phone_number`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `unhashed_password`, `remember_token`, `current_team_id`, `profile_photo_path`, `created_at`, `updated_at`) VALUES
(2, 'admin', 'admin', 'admin@gmail.com', 'admin@admin.com', '0941797543', '2024-07-24 05:16:47', '$2y$12$AVYD/lebQ9wRznuJo5QoFe8WXTmplxeiwFHE0pASa2fPgtJDmSuxu', NULL, NULL, NULL, 'password', '1syed0RU78', NULL, NULL, '2024-07-24 05:16:47', '2024-07-24 05:16:47'),
(20, NULL, 'Alif', NULL, 'Alif', '0941797542', NULL, '$2y$12$5mxbketYF8rB0xarmKfK/eUTrywxPXsGKm640gyfWhcjAeg/aaF9m', NULL, NULL, NULL, 'k42r0r', NULL, NULL, NULL, '2024-08-09 04:18:51', '2024-08-11 02:24:13'),
(22, NULL, 'Alif', NULL, 'Alif2', '0941797544', NULL, '$2y$12$OXWPJYcuXoleZeWYJjMAqulHuQoywxIaSUkmjy.2AS8fGKKzlnagi', NULL, NULL, NULL, 'tiopua', NULL, NULL, NULL, '2024-08-11 01:22:15', '2024-08-12 21:37:29'),
(31, NULL, 'Alif12', 'aliftesfaye8@gmail.com', 'Alif12', '0941797565', NULL, '$2y$12$xJxU2MWs4QBxIqMnc3HxZeEzKpWeijPEo/z.jdOH/epQX/dh9Oj4S', NULL, NULL, NULL, '149fqh', NULL, NULL, NULL, '2024-09-10 04:45:51', '2024-09-10 04:45:51'),
(47, NULL, 'Alif11', 'aliftesfaye@gmail.com', 'Alif11', '+251941797541', NULL, '$2y$12$VOdl2cOJlL.UKTT5yTlziu8vwhKjBwHBEAXP77B6YKgFFzeF7z5Je', NULL, NULL, NULL, '0xp0ca', NULL, NULL, NULL, '2024-09-10 10:52:08', '2024-09-10 10:52:08');

-- --------------------------------------------------------

--
-- Table structure for table `work_orders`
--

CREATE TABLE `work_orders` (
  `id` char(36) NOT NULL,
  `contractor_id` char(36) NOT NULL,
  `request_id` char(36) NOT NULL,
  `work_description` text DEFAULT NULL,
  `scheduled_date` date NOT NULL,
  `completion_date` date DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `status` enum('in_progress','completed','canceled') NOT NULL DEFAULT 'in_progress',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `work_orders`
--

INSERT INTO `work_orders` (`id`, `contractor_id`, `request_id`, `work_description`, `scheduled_date`, `completion_date`, `cost`, `status`, `created_at`, `updated_at`) VALUES
('5e00962b-14cf-4291-a522-11230fc62385', 'dac38cd6-e5e8-430a-bdd7-0805fb9a3a09', '1c14c63a-5a33-4d56-b5f3-9b9edf051eef', 'jhj', '2024-08-13', '2024-08-22', 6750.00, 'completed', '2024-08-10 04:45:12', '2024-08-29 00:33:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `building_units`
--
ALTER TABLE `building_units`
  ADD PRIMARY KEY (`id`),
  ADD KEY `building_units_building_id_foreign` (`building_id`);

--
-- Indexes for table `building_unit_room_types`
--
ALTER TABLE `building_unit_room_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `businesses_owner_id_foreign` (`owner_id`);

--
-- Indexes for table `business_owners`
--
ALTER TABLE `business_owners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `business_owners_user_id_foreign` (`user_id`);

--
-- Indexes for table `business_types`
--
ALTER TABLE `business_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leases`
--
ALTER TABLE `leases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leases_tenant_id_foreign` (`tenant_id`),
  ADD KEY `leases_building_unit_id_foreign` (`building_unit_id`);

--
-- Indexes for table `list_of_banks`
--
ALTER TABLE `list_of_banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `maintenance_contractors`
--
ALTER TABLE `maintenance_contractors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `maintenance_contractors_company_name_unique` (`company_name`),
  ADD UNIQUE KEY `maintenance_contractors_phone_unique` (`phone`),
  ADD UNIQUE KEY `maintenance_contractors_email_unique` (`email`);

--
-- Indexes for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `maintenance_requests_building_unit_id_foreign` (`building_unit_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_unit_foreign` (`unit`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_lease_id_foreign` (`lease_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `permission_user`
--
ALTER TABLE `permission_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permission_user_user_id_permission_id_unique` (`user_id`,`permission_id`),
  ADD KEY `permission_user_permission_id_foreign` (`permission_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD KEY `role_user_role_id_foreign` (`role_id`),
  ADD KEY `role_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sms`
--
ALTER TABLE `sms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tenants`
--
ALTER TABLE `tenants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tenants_business_id_foreign` (`business_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_user_name_unique` (`user_name`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_number_unique` (`phone_number`);

--
-- Indexes for table `work_orders`
--
ALTER TABLE `work_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_orders_contractor_id_foreign` (`contractor_id`),
  ADD KEY `work_orders_request_id_foreign` (`request_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `building_unit_room_types`
--
ALTER TABLE `building_unit_room_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `business_types`
--
ALTER TABLE `business_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `list_of_banks`
--
ALTER TABLE `list_of_banks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permission_user`
--
ALTER TABLE `permission_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sms`
--
ALTER TABLE `sms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `building_units`
--
ALTER TABLE `building_units`
  ADD CONSTRAINT `building_units_building_id_foreign` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`);

--
-- Constraints for table `businesses`
--
ALTER TABLE `businesses`
  ADD CONSTRAINT `businesses_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `business_owners` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_owners`
--
ALTER TABLE `business_owners`
  ADD CONSTRAINT `business_owners_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leases`
--
ALTER TABLE `leases`
  ADD CONSTRAINT `leases_building_unit_id_foreign` FOREIGN KEY (`building_unit_id`) REFERENCES `building_units` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leases_tenant_id_foreign` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `maintenance_requests`
--
ALTER TABLE `maintenance_requests`
  ADD CONSTRAINT `maintenance_requests_building_unit_id_foreign` FOREIGN KEY (`building_unit_id`) REFERENCES `building_units` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_unit_foreign` FOREIGN KEY (`unit`) REFERENCES `building_units` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_lease_id_foreign` FOREIGN KEY (`lease_id`) REFERENCES `leases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permission_user`
--
ALTER TABLE `permission_user`
  ADD CONSTRAINT `permission_user_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permission_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tenants`
--
ALTER TABLE `tenants`
  ADD CONSTRAINT `tenants_business_id_foreign` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
