-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 16, 2025 at 02:03 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banyu_makmur`
--

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(50) NOT NULL,
  `salary` decimal(12,2) NOT NULL,
  `join_date` date NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `position`, `salary`, `join_date`, `phone`, `address`, `created_at`) VALUES
(1, 'Dewi Sartika', 'Manager', '5000000.00', '2023-01-14', '081234567893', 'Jl. Karyawan No. 15', '2025-08-21 07:05:34'),
(2, 'Eko Prasetyo', 'Supervisor', '3500000.00', '2023-02-20', '081234567894', 'Jl. Karyawan No. 2', '2025-08-21 07:05:34'),
(3, 'Fitri Handayani', 'Staff', '2500000.00', '2023-03-10', '081234567895', 'Jl. Karyawan No. 3', '2025-08-21 07:05:34'),
(4, 'solimin', 'operator', '4000000.00', '2025-08-27', '12345679', 'sengon', '2025-08-27 06:42:37'),
(6, 'eko hadi', 'loper', '2000000.00', '2025-08-31', '0821364512', 'manggihan', '2025-08-31 15:13:16');

-- --------------------------------------------------------

--
-- Table structure for table `employee_attendances`
--

CREATE TABLE `employee_attendances` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('hadir','ijin','libur','sakit') NOT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employee_attendances`
--

INSERT INTO `employee_attendances` (`id`, `employee_id`, `date`, `status`, `notes`) VALUES
(83, 3, '2025-08-31', 'libur', 'Minggu'),
(84, 1, '2025-08-31', 'libur', 'Minggu'),
(85, 2, '2025-08-29', 'hadir', ''),
(86, 1, '2025-08-29', 'hadir', ''),
(87, 2, '2025-08-31', 'libur', 'Minggu'),
(88, 1, '2025-08-30', 'hadir', ''),
(89, 3, '2025-08-30', 'hadir', ''),
(90, 1, '2025-08-28', 'hadir', ''),
(91, 2, '2025-08-30', 'hadir', ''),
(92, 3, '2025-08-29', 'hadir', ''),
(93, 2, '2025-08-28', 'hadir', ''),
(94, 3, '2025-08-28', 'hadir', ''),
(95, 1, '2025-08-27', 'hadir', ''),
(96, 2, '2025-08-27', 'hadir', ''),
(97, 3, '2025-08-27', 'hadir', ''),
(98, 1, '2025-08-26', 'sakit', 'Demam'),
(99, 2, '2025-08-26', 'hadir', ''),
(100, 3, '2025-08-26', 'hadir', ''),
(101, 1, '2025-08-25', 'hadir', ''),
(102, 2, '2025-08-25', 'hadir', ''),
(103, 3, '2025-08-25', 'hadir', ''),
(104, 1, '2025-08-24', 'libur', 'Minggu'),
(105, 2, '2025-08-24', 'libur', 'Minggu'),
(106, 3, '2025-08-24', 'libur', 'Minggu'),
(107, 1, '2025-08-23', 'hadir', ''),
(108, 2, '2025-08-23', 'ijin', 'Acara keluarga'),
(109, 3, '2025-08-23', 'hadir', ''),
(110, 1, '2025-08-22', 'hadir', ''),
(111, 2, '2025-08-22', 'hadir', ''),
(112, 3, '2025-08-22', 'hadir', ''),
(113, 1, '2025-08-21', 'hadir', ''),
(114, 2, '2025-08-21', 'hadir', ''),
(115, 3, '2025-08-21', 'hadir', ''),
(116, 1, '2025-08-20', 'hadir', ''),
(117, 2, '2025-08-20', 'hadir', ''),
(118, 3, '2025-08-20', 'hadir', ''),
(119, 1, '2025-08-19', 'hadir', ''),
(120, 2, '2025-08-19', 'hadir', ''),
(121, 3, '2025-08-19', 'sakit', 'Sakit perut'),
(122, 1, '2025-08-18', 'hadir', ''),
(123, 2, '2025-08-18', 'hadir', ''),
(124, 3, '2025-08-18', 'hadir', ''),
(125, 1, '2025-08-17', 'libur', 'Minggu'),
(126, 2, '2025-08-17', 'libur', 'Minggu'),
(127, 3, '2025-08-17', 'libur', 'Minggu'),
(128, 1, '2025-08-16', 'ijin', 'Urusan pribadi'),
(129, 2, '2025-08-16', 'hadir', ''),
(130, 3, '2025-08-16', 'hadir', ''),
(131, 1, '2025-08-15', 'hadir', ''),
(132, 2, '2025-08-15', 'hadir', ''),
(133, 3, '2025-08-15', 'hadir', ''),
(134, 1, '2025-08-14', 'hadir', ''),
(135, 2, '2025-08-14', 'hadir', ''),
(136, 3, '2025-08-14', 'hadir', ''),
(137, 1, '2025-08-13', 'hadir', ''),
(138, 2, '2025-08-13', 'sakit', 'Flu'),
(139, 3, '2025-08-13', 'hadir', ''),
(140, 1, '2025-08-12', 'hadir', ''),
(141, 2, '2025-08-12', 'hadir', ''),
(142, 3, '2025-08-12', 'hadir', ''),
(143, 1, '2025-08-11', 'hadir', ''),
(144, 2, '2025-08-11', 'hadir', ''),
(145, 3, '2025-08-11', 'hadir', ''),
(146, 1, '2025-08-10', 'libur', 'Minggu'),
(147, 2, '2025-08-10', 'libur', 'Minggu'),
(148, 3, '2025-08-10', 'libur', 'Minggu'),
(149, 1, '2025-08-09', 'hadir', ''),
(150, 2, '2025-08-09', 'hadir', ''),
(151, 3, '2025-08-09', 'ijin', 'Rapat keluarga'),
(152, 1, '2025-08-08', 'hadir', ''),
(153, 2, '2025-08-08', 'hadir', ''),
(154, 3, '2025-08-08', 'hadir', ''),
(155, 1, '2025-08-07', 'hadir', ''),
(156, 2, '2025-08-07', 'hadir', ''),
(157, 3, '2025-08-07', 'hadir', ''),
(158, 1, '2025-08-06', 'hadir', ''),
(159, 2, '2025-08-06', 'hadir', ''),
(160, 3, '2025-08-06', 'hadir', ''),
(161, 1, '2025-08-05', 'hadir', ''),
(162, 2, '2025-08-05', 'hadir', ''),
(163, 3, '2025-08-05', 'hadir', ''),
(164, 1, '2025-08-04', 'hadir', ''),
(165, 2, '2025-08-04', 'hadir', ''),
(166, 3, '2025-08-04', 'hadir', ''),
(167, 1, '2025-08-03', 'libur', 'Minggu'),
(168, 2, '2025-08-03', 'libur', 'Minggu'),
(169, 3, '2025-08-03', 'libur', 'Minggu'),
(170, 1, '2025-08-02', 'hadir', ''),
(171, 2, '2025-08-02', 'hadir', ''),
(172, 3, '2025-08-02', 'hadir', ''),
(173, 6, '2025-08-31', 'hadir', ''),
(174, 6, '2025-09-04', 'hadir', ''),
(175, 4, '2025-09-04', 'hadir', ''),
(176, 1, '2025-09-04', 'hadir', ''),
(177, 6, '2025-09-05', 'hadir', ''),
(178, 4, '2025-09-05', 'hadir', ''),
(179, 3, '2025-09-05', 'hadir', ''),
(180, 2, '2025-09-05', 'hadir', ''),
(181, 3, '2025-09-06', 'hadir', ''),
(182, 1, '2025-09-06', 'sakit', ''),
(183, 6, '2025-09-06', 'ijin', ''),
(184, 4, '2025-09-06', 'ijin', ''),
(185, 2, '2025-09-06', 'sakit', ''),
(186, 4, '2025-09-07', 'sakit', ''),
(187, 6, '2025-09-07', 'hadir', ''),
(188, 1, '2025-09-07', 'libur', ''),
(189, 2, '2025-09-07', 'ijin', ''),
(190, 1, '2025-09-07', 'hadir', ''),
(191, 2, '2025-09-07', 'sakit', ''),
(192, 3, '2025-09-07', 'ijin', ''),
(193, 4, '2025-09-07', 'libur', ''),
(194, 4, '2025-09-08', 'hadir', ''),
(195, 6, '2025-09-08', 'hadir', ''),
(197, 2, '2025-09-08', 'sakit', ''),
(198, 3, '2025-09-08', 'hadir', ''),
(199, 1, '2025-09-08', 'ijin', ''),
(200, 6, '2025-09-12', 'hadir', ''),
(201, 4, '2025-09-12', 'hadir', ''),
(202, 1, '2025-09-12', 'hadir', ''),
(203, 2, '2025-09-12', 'hadir', ''),
(204, 3, '2025-09-12', 'hadir', ''),
(206, 4, '2025-09-15', 'hadir', ''),
(207, 6, '2025-09-16', 'hadir', ''),
(208, 6, '2025-10-17', 'hadir', ''),
(209, 6, '2025-10-21', 'hadir', ''),
(210, 4, '2025-10-21', 'hadir', ''),
(211, 1, '2025-10-21', 'ijin', ''),
(212, 2, '2025-10-21', 'hadir', ''),
(213, 3, '2025-10-21', 'hadir', ''),
(214, 6, '2025-10-22', 'hadir', ''),
(215, 4, '2025-10-22', 'ijin', ''),
(216, 1, '2025-10-22', 'hadir', ''),
(217, 2, '2025-10-22', 'hadir', ''),
(218, 3, '2025-10-22', 'sakit', '');

-- --------------------------------------------------------

--
-- Table structure for table `employee_salaries`
--

CREATE TABLE `employee_salaries` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `base_salary` decimal(12,2) NOT NULL,
  `present_days` int NOT NULL DEFAULT '0',
  `absent_days` int NOT NULL DEFAULT '0',
  `sick_days` int NOT NULL DEFAULT '0',
  `holiday_days` int NOT NULL DEFAULT '0',
  `total_working_days` int NOT NULL DEFAULT '0',
  `salary_per_day` decimal(12,2) NOT NULL,
  `total_salary` decimal(12,2) NOT NULL,
  `deductions` decimal(12,2) NOT NULL DEFAULT '0.00',
  `bonuses` decimal(12,2) NOT NULL DEFAULT '0.00',
  `final_salary` decimal(12,2) NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employee_salaries`
--

INSERT INTO `employee_salaries` (`id`, `employee_id`, `month`, `year`, `base_salary`, `present_days`, `absent_days`, `sick_days`, `holiday_days`, `total_working_days`, `salary_per_day`, `total_salary`, `deductions`, `bonuses`, `final_salary`, `notes`, `created_at`) VALUES
(1, 1, 8, 2025, '5000000.00', 23, 1, 1, 5, 24, '227272.73', '5454545.45', '0.00', '0.00', '5454545.45', '', '2025-08-29 04:05:58'),
(2, 2, 8, 2025, '3500000.00', 25, 1, 1, 0, 26, '159090.91', '4136363.64', '0.00', '0.00', '4136363.64', '', '2025-08-29 04:05:58'),
(3, 3, 8, 2025, '2500000.00', 3, 1, 1, 0, 4, '113636.36', '454545.45', '0.00', '0.00', '454545.45', '', '2025-08-29 04:05:58'),
(4, 4, 8, 2025, '4000000.00', 0, 0, 0, 0, 0, '181818.18', '0.00', '0.00', '0.00', '0.00', '', '2025-08-29 04:12:31');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int NOT NULL,
  `category` varchar(50) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `date` date NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `proof_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `category`, `amount`, `date`, `description`, `created_at`, `proof_image`) VALUES
(1, 'Listrik', '2500000.00', '2025-08-21', 'Tagihan listrik bulan ini', '2025-08-21 07:05:34', NULL),
(2, 'Air', '500000.00', '2025-08-21', 'Tagihan air bulan ini', '2025-08-21 07:05:34', NULL),
(3, 'Internet', '300000.00', '2025-08-21', 'Tagihan internet bulan ini', '2025-08-21 07:05:34', NULL),
(4, 'peralatan', '130000.00', '2025-08-22', 'lunas', '2025-08-23 14:37:57', 'proof_image-1757948204176-728049477.png'),
(5, 'susu segar', '100000.00', '2025-08-26', 'pemasukan', '2025-08-27 06:34:07', 'proof_image-1757948172688-464100802.png'),
(6, 'cita nasional', '1500000.00', '2025-08-24', 'lunas', '2025-08-27 06:40:27', 'proof_image-1756276827268-939512496.png'),
(7, 'listrik', '10000.00', '2025-09-15', '', '2025-09-15 15:39:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `incomes`
--

CREATE TABLE `incomes` (
  `id` int NOT NULL,
  `source` varchar(100) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `date` date NOT NULL,
  `proof_image` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `incomes`
--

INSERT INTO `incomes` (`id`, `source`, `amount`, `date`, `proof_image`, `description`, `created_at`) VALUES
(1, 'PT Susu Segar', '50000000.00', '2025-08-21', NULL, 'Pembayaran bulanan', '2025-08-21 07:05:34'),
(2, 'PT Susu Murni', '35000000.00', '2025-08-21', NULL, 'Pembayaran bulanan', '2025-08-21 07:05:34'),
(3, 'pinjol', '10000000.00', '2025-08-23', NULL, 'simpan pinjam', '2025-08-23 14:37:24'),
(4, 'susu segar', '50000.00', '2025-08-26', 'proof_image-1756183628479-543180594.png', 'pemasukan', '2025-08-26 04:47:08'),
(5, 'a', '13.00', '2025-08-27', NULL, '', '2025-08-27 06:41:30'),
(6, 'pendapatan susu', '100000.00', '2025-08-29', 'proof_image-1756466670300-480027471.png', '', '2025-08-29 11:24:30'),
(7, 'kerja sama', '100000.00', '2025-09-01', 'proof_image-1757947685082-851147243.png', '', '2025-09-01 16:06:10'),
(9, 'bri', '1300000.00', '2025-09-08', 'proof_image-1757272763063-418332178.png', 'approved', '2025-09-07 19:18:20'),
(11, 'ovo', '2000000.00', '2025-09-08', 'proof_image-1757273422182-601509440.png', 'belum lunas', '2025-09-07 19:28:21');

-- --------------------------------------------------------

--
-- Table structure for table `maintenances`
--

CREATE TABLE `maintenances` (
  `id` int NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `cost` decimal(12,2) NOT NULL,
  `description` text,
  `photo_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `maintenances`
--

INSERT INTO `maintenances` (`id`, `item_name`, `start_date`, `end_date`, `cost`, `description`, `photo_path`, `created_at`) VALUES
(1, 'Mesin Pasteurisasi', '2025-08-21', '2025-08-21', '5000000.00', 'Pemeliharaan rutin mesin pasteurisasi', NULL, '2025-08-21 07:05:34'),
(2, 'peralatan', '2025-08-14', '2025-08-24', '13500000.00', '', 'photo-1756046862843-595204758.jpg', '2025-08-24 14:47:42'),
(3, 'cooler', '2025-08-16', '2025-08-27', '15000000.00', 'pembersihan mesin cooler', 'photo-1756271004964-123467043.png', '2025-08-27 05:03:24'),
(4, 'genset listrik', '2025-08-24', '2025-08-24', '230000.00', 'perbaikan', 'photo-1757947694149-552046815.png', '2025-08-27 05:05:59'),
(6, 'listrik', '2025-09-15', '2025-09-15', '10000.00', '', NULL, '2025-09-15 15:39:08');

-- --------------------------------------------------------

--
-- Table structure for table `milk_collections`
--

CREATE TABLE `milk_collections` (
  `id` int NOT NULL,
  `collector_id` int NOT NULL,
  `morning_amount` decimal(10,2) NOT NULL,
  `afternoon_amount` decimal(10,2) NOT NULL,
  `price_per_liter` decimal(10,2) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `milk_collections`
--

INSERT INTO `milk_collections` (`id`, `collector_id`, `morning_amount`, `afternoon_amount`, `price_per_liter`, `date`) VALUES
(1, 1, '25.50', '30.20', '8500.00', '2025-08-21'),
(2, 2, '20.00', '22.50', '8500.00', '2025-08-21'),
(3, 3, '18.80', '19.50', '8500.00', '2025-08-21'),
(4, 4, '5.00', '0.00', '5000.00', '2025-08-21'),
(5, 4, '19.00', '0.00', '6000.00', '2025-08-23'),
(6, 4, '0.00', '10.00', '6000.00', '2025-08-23'),
(7, 4, '10.00', '0.00', '6000.00', '2025-08-24'),
(8, 4, '10.00', '0.00', '6000.00', '2025-08-27'),
(15, 4, '15.00', '0.00', '5000.00', '2025-09-01'),
(16, 4, '0.00', '12.00', '5000.00', '2025-09-01'),
(17, 1, '12.00', '0.00', '10000.00', '2025-09-01'),
(18, 1, '0.00', '10.00', '9000.00', '2025-09-01'),
(19, 3, '10.00', '0.00', '9000.00', '2025-09-01'),
(20, 3, '0.00', '7.00', '10000.00', '2025-09-01'),
(21, 2, '4.00', '0.00', '5000.00', '2025-09-01'),
(25, 4, '11.00', '0.00', '6000.00', '2025-09-06'),
(26, 4, '0.00', '10.00', '8000.00', '2025-09-06'),
(27, 8, '8.00', '0.00', '7000.00', '2025-09-08'),
(29, 8, '0.00', '1.00', '1000.00', '2025-09-08'),
(30, 8, '12.00', '0.00', '1000.00', '2025-09-15'),
(31, 8, '0.00', '10.00', '9000.00', '2025-09-15'),
(32, 8, '34.00', '0.00', '6000.00', '2025-09-16'),
(33, 8, '12.00', '13.00', '7500.00', '2025-10-17'),
(34, 4, '43.00', '25.00', '8000.00', '2025-10-17'),
(35, 2, '34.00', '0.00', '6500.00', '2025-10-17'),
(36, 8, '12.00', '8.00', '8000.00', '2025-10-21'),
(37, 5, '47.00', '35.00', '7500.00', '2025-10-21'),
(38, 4, '69.00', '48.00', '7000.00', '2025-10-21'),
(39, 1, '56.00', '35.00', '6500.00', '2025-10-21'),
(40, 2, '45.00', '29.00', '8000.00', '2025-10-21'),
(41, 3, '90.00', '80.00', '7000.00', '2025-10-21'),
(42, 8, '13.00', '0.00', '6500.00', '2025-10-22'),
(43, 5, '167.00', '0.00', '8000.00', '2025-10-22'),
(44, 1, '237.00', '0.00', '7000.00', '2025-10-22');

-- --------------------------------------------------------

--
-- Table structure for table `milk_collectors`
--

CREATE TABLE `milk_collectors` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` text,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `milk_collectors`
--

INSERT INTO `milk_collectors` (`id`, `name`, `address`, `phone`, `created_at`) VALUES
(1, 'Ahmad Susanto', 'Jl. Raya Susu No. 1, Jakarta', '081234567890', '2025-08-21 07:05:34'),
(2, 'Budi Santoso', 'Jl. Peternakan No. 5, Bandung', '081234567891', '2025-08-21 07:05:34'),
(3, 'Citra Dewi', 'Jl. Sapi Perah No. 10, Surabaya', '081234567892', '2025-08-21 07:05:34'),
(4, 'hari', 'manggihan', '081477031387', '2025-08-21 10:14:54'),
(5, 'ekohadi', 'manggihan', '08234567', '2025-08-29 11:21:06'),
(8, 'gimin', 'sengon', '08364782564', '2025-09-07 19:02:01');

-- --------------------------------------------------------

--
-- Table structure for table `milk_shipments`
--

CREATE TABLE `milk_shipments` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `milk_shipments`
--

INSERT INTO `milk_shipments` (`id`, `date`, `amount`, `destination`, `notes`, `created_at`) VALUES
(1, '2025-09-02', '11.00', 'sumogawe', 'lunas', '2025-09-01 17:10:52'),
(2, '2025-09-04', '1500.00', 'bandung', 'lunas\n', '2025-09-04 14:06:54'),
(3, '2025-09-06', '2000.00', 'jakarta', 'cimory\n', '2025-09-06 07:34:23'),
(5, '2025-09-05', '513.00', 'boyolali kota', 'lunas', '2025-09-06 08:42:22'),
(6, '2025-09-01', '2000.00', 'cita nasional', 'lunas', '2025-09-07 19:54:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `google_id` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `auth_provider` enum('local','google') DEFAULT 'local',
  `reset_token` text,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `fullname`, `created_at`, `google_id`, `profile_picture`, `email`, `auth_provider`, `reset_token`, `reset_token_expires`) VALUES
(1, 'admin', '$2a$10$Y6ahx5FHMwNBajv1TP1vi.WafHXh46hq6rolfhpj9Lgm/aJ8Az0x.', 'Administrator', '2025-08-21 07:05:34', NULL, NULL, NULL, 'local', NULL, NULL),
(3, 'testuser', '$2a$10$0xOFPVNYdAVKxEBC7xeLYeoWRPjAExESUUsFpwUcDWrUn2rtH0VE.', 'Test User', '2025-10-13 15:33:34', NULL, NULL, NULL, 'local', NULL, NULL),
(4, 'ab', '$2a$10$t9LEXCRm5hw7EZMXVz7TSeD3fMiWCaqQRhfPEHbqL5Lf6Z.KpczLG', 'Test', '2025-10-13 15:35:38', NULL, NULL, NULL, 'local', NULL, NULL),
(5, 'client_demo', '$2a$10$lAu7CvWBanzvwAr2IZyo/.AH6.9APDZALyaqx.VIYQNHv70NVyoCi', 'Client Demo User', '2025-10-13 15:39:44', NULL, NULL, NULL, 'local', NULL, NULL),
(6, 'staff', '$2a$10$JkiuEGJkyN2WDILvGi6jyedr2HIUv6Qysyybul37T4XADsilCaJGC', 'staff', '2025-10-17 07:42:12', NULL, NULL, NULL, 'local', NULL, NULL),
(7, 'eko', '$2a$10$Md8pSTxVWQXE0bjJndpk9e0bmfyUgiIKlAQHjcX820n9krMUERVOK', 'eko hadi', '2025-10-22 14:52:54', NULL, NULL, NULL, 'local', NULL, NULL),
(8, 'hadi', '$2a$10$zM6MEa3n9bYiMf/YK1cUpOM.n/qvFTJ1NCU4xGzDbrn290t98u4SG', 'hadi', '2025-10-22 14:53:52', NULL, NULL, NULL, 'local', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_attendances`
--
ALTER TABLE `employee_attendances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_month_year` (`employee_id`,`month`,`year`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `incomes`
--
ALTER TABLE `incomes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `maintenances`
--
ALTER TABLE `maintenances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `milk_collections`
--
ALTER TABLE `milk_collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collector_id` (`collector_id`);

--
-- Indexes for table `milk_collectors`
--
ALTER TABLE `milk_collectors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `milk_shipments`
--
ALTER TABLE `milk_shipments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `idx_google_id` (`google_id`),
  ADD UNIQUE KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `employee_attendances`
--
ALTER TABLE `employee_attendances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=219;

--
-- AUTO_INCREMENT for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `incomes`
--
ALTER TABLE `incomes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `maintenances`
--
ALTER TABLE `maintenances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `milk_collections`
--
ALTER TABLE `milk_collections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `milk_collectors`
--
ALTER TABLE `milk_collectors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `milk_shipments`
--
ALTER TABLE `milk_shipments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employee_attendances`
--
ALTER TABLE `employee_attendances`
  ADD CONSTRAINT `employee_attendances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `employee_salaries`
--
ALTER TABLE `employee_salaries`
  ADD CONSTRAINT `employee_salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `milk_collections`
--
ALTER TABLE `milk_collections`
  ADD CONSTRAINT `milk_collections_ibfk_1` FOREIGN KEY (`collector_id`) REFERENCES `milk_collectors` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
