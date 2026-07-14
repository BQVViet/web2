-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 14, 2026 lúc 08:13 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cinema_db`
--
CREATE DATABASE IF NOT EXISTS `cinema_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `cinema_db`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `banners`
--

INSERT INTO `banners` (`id`, `is_active`, `image_url`, `target_url`, `title`) VALUES
(1, b'1', 'https://i.pinimg.com/736x/a0/93/62/a09362d70e873bd4c9c6e4fdb4bc2ebb.jpg', '/movies/2', 'Godzilla x Kong'),
(3, b'1', 'https://i.pinimg.com/1200x/a9/86/b7/a986b74c0f5afa489f2b96646f6bdadf.jpg', '/movies/3', 'Dune 2'),
(4, b'1', 'https://i.pinimg.com/736x/0a/4b/29/0a4b29a93b2dbe226fd5d69a8d09105e.jpg', '', 'Banner Khuyến mãi'),
(5, b'1', 'http://i.pinimg.com/1200x/5a/25/c4/5a25c4a4b907cab092ba476f436c1836.jpg', '', 'Banner IMAX - 4DX');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cinemas`
--

CREATE TABLE `cinemas` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cinemas`
--

INSERT INTO `cinemas` (`id`, `address`, `name`, `phone`) VALUES
(1, '72 Lê Thánh Tôn, Q.1, TP.HCM', 'CGV Vincom Center', '19001234'),
(2, '469 Nguyễn Hữu Thọ, Q.7, TP.HCM', 'Lotte Cinema Nam Sài Gòn', '19005678'),
(3, '116 Nguyễn Du, Q.1, TP.HCM', 'Galaxy Nguyễn Du', '19009090'),
(4, 'Vincom Thảo Điền, Q.2, TP.HCM', 'BHD Star Thảo Điền', '19001010');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `foods_drinks`
--

CREATE TABLE `foods_drinks` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `stock_quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `foods_drinks`
--

INSERT INTO `foods_drinks` (`id`, `active`, `description`, `image_url`, `name`, `price`, `stock_quantity`) VALUES
(1, b'1', 'Bắp ngọt cỡ lớn', '/images/popcorn.jpg', 'Bắp Rang Bơ (Lớn)', 65000, 95),
(2, b'1', 'Nước ngọt Pepsi cỡ lớn', '/images/pepsi.jpg', 'Pepsi (Lớn)', 45000, 144),
(3, b'1', '1 Bắp lớn + 2 Nước lớn', '/images/combo.jpg', 'Combo Couple', 135000, 39);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) NOT NULL,
  `created_date` datetime(6) NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL,
  `total_amount` double NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `invoices`
--

INSERT INTO `invoices` (`id`, `created_date`, `payment_method`, `payment_status`, `total_amount`, `user_id`) VALUES
(57, '2026-07-14 06:07:05.000000', 'VNPay', 'SUCCESS', 355000, 7),
(58, '2026-07-14 06:11:10.000000', 'Thanh toán tại quầy', 'SUCCESS', 125000, 28),
(59, '2026-07-14 06:11:17.000000', 'VNPay', 'PENDING', 105000, 28),
(60, '2026-07-14 06:11:17.000000', 'Momo', 'SUCCESS', 105000, 28);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `invoice_details`
--

CREATE TABLE `invoice_details` (
  `id` bigint(20) NOT NULL,
  `flavor` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `food_drink_id` bigint(20) NOT NULL,
  `invoice_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `invoice_details`
--

INSERT INTO `invoice_details` (`id`, `flavor`, `quantity`, `food_drink_id`, `invoice_id`) VALUES
(21, 'Phô mai', 1, 3, 57);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `movies`
--

CREATE TABLE `movies` (
  `id` bigint(20) NOT NULL,
  `age_rating` varchar(255) DEFAULT NULL,
  `cast` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  `release_date` date DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `movies`
--

INSERT INTO `movies` (`id`, `age_rating`, `cast`, `description`, `director`, `duration_minutes`, `genre`, `language`, `poster_url`, `release_date`, `status`, `title`) VALUES
(1, '18+', 'Phương Anh Đào, Tuấn Trần', 'Một bộ phim tình cảm gia đình sâu sắc.', 'Trấn Thành', 131, 'Tình cảm', 'Tiếng Việt', 'https://i.pinimg.com/736x/ee/33/c7/ee33c723b88dc2ff5b19ec771ef5f3f2.jpg', '2024-02-10', 'DANG_CHIEU', 'Mai'),
(2, 'P', 'Rebecca Hall', 'Cuộc chiến siêu kinh điển.', 'Adam Wingard', 115, 'Hành động', 'Tiếng Anh', 'https://i.pinimg.com/736x/15/ff/fa/15fffadca7eaefa4045c4ae66f5068f5.jpg', '2024-03-29', 'DANG_CHIEU', 'Godzilla x Kong: The New Empire'),
(3, 'P', 'Timothée Chalamet, Zendaya', 'Hành trình trả thù của Paul Atreides.', 'Denis Villeneuve', 166, 'Hành động', 'Tiếng Anh', 'https://i.pinimg.com/736x/1a/12/e4/1a12e43e9f2083ffca2174bdaeaa2968.jpg', '2024-03-01', 'DANG_CHIEU', 'Dune: Hành Tinh Cát 2'),
(4, 'P', 'Jack Black, Awkwafina', 'Po bước vào hành trình mới.', 'Mike Mitchell', 94, 'Hoạt hình', 'Lồng Tiếng', 'https://i.pinimg.com/736x/17/be/c0/17bec0964acf2fd4cb61dd75727f1600.jpg', '2024-03-08', 'DANG_CHIEU', 'Kung Fu Panda 4'),
(5, 'P', 'Choi Min-sik, Kim Go-eun', 'Câu chuyện kinh dị bí ẩn.', 'Jang Jae-hyun', 134, 'Kinh dị', 'Tiếng Hàn', 'https://i.pinimg.com/736x/9b/8c/2d/9b8c2dd17b61405859c94290c7ff5586.jpg', '2024-03-15', 'ĐANG CHIẾU', 'Exhuma: Quật Mộ Trùng Ma'),
(6, '13+', 'David Corenswet, Rachel Brosnahan, Nicholas Hoult, Skyler Gisondo', '', 'James Gunn', 129, 'Hành động', 'Tiếng Anh (Phụ đề Tiếng Việt)', 'https://i.pinimg.com/736x/61/4e/f2/614ef2b62f2ba21bc75cf0fa7f0c56c5.jpg', '2025-07-11', 'ĐANG CHIẾU', 'Superman');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `target_url` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `promotions`
--

INSERT INTO `promotions` (`id`, `active`, `description`, `image_url`, `target_url`, `title`) VALUES
(1, b'1', 'Áp dụng cho tất cả khách hàng thành viên CGV trên toàn quốc khi đặt vé trực tuyến.', '/images/media__1781694318215.png', '#', 'ĐỒNG GIÁ 79.000 ĐỒNG'),
(2, b'1', 'Trọn gói tiện lợi, trọn vẹn trải nghiệm dịch vụ bắp nước và vé xem phim trực tuyến.', '/images/media__1781694331166.png', '#', 'NEW FUNCTION ONLINE PACKAGE'),
(3, b'1', 'Đăng ký thành viên CGV hôm nay nhận ngay những phần quà hấp dẫn từ CGV Cinemas.', '/images/media__1781694342202.png', '#', 'GIA NHẬP NGAY - QUÀ TẶNG ĐẦY TAY'),
(4, b'1', 'Quà tặng sinh nhật đặc biệt dành riêng cho các thành viên thân thiết của CGV.', '/images/media__1781694364694.png', '#', 'HAPPY BIRTHDAY TO CGV MEMBERS!');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `cinema_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `rooms`
--

INSERT INTO `rooms` (`id`, `capacity`, `name`, `status`, `cinema_id`) VALUES
(1, 100, 'Phòng 1', 'ACTIVE', 1),
(2, 150, 'Phòng 2', 'ACTIVE', 1),
(3, 100, 'Phòng IMAX', 'ACTIVE', 1),
(4, 120, 'Phòng 1 (Lotte)', 'ACTIVE', 2),
(5, 50, 'Phòng VIP', 'ACTIVE', 2),
(6, 100, 'Phòng 1 (Galaxy)', 'ACTIVE', 3),
(7, 100, 'Phòng 1 (BHD)', 'ACTIVE', 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `seats`
--

CREATE TABLE `seats` (
  `id` bigint(20) NOT NULL,
  `row_number` varchar(255) NOT NULL,
  `seat_number` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `room_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `seats`
--

INSERT INTO `seats` (`id`, `row_number`, `seat_number`, `status`, `type`, `room_id`) VALUES
(1, 'A', 1, 'AVAILABLE', 'COUPLE', 1),
(2, 'A', 2, 'AVAILABLE', 'VIP', 1),
(3, 'A', 3, 'AVAILABLE', 'VIP', 1),
(4, 'A', 4, 'AVAILABLE', 'VIP', 1),
(5, 'A', 5, 'AVAILABLE', 'VIP', 1),
(6, 'A', 6, 'AVAILABLE', 'VIP', 1),
(7, 'A', 7, 'AVAILABLE', 'VIP', 1),
(8, 'A', 8, 'AVAILABLE', 'VIP', 1),
(9, 'A', 9, 'AVAILABLE', 'VIP', 1),
(10, 'A', 10, 'AVAILABLE', 'VIP', 1),
(11, 'A', 11, 'AVAILABLE', 'VIP', 1),
(12, 'A', 12, 'AVAILABLE', 'COUPLE', 1),
(13, 'B', 1, 'AVAILABLE', 'COUPLE', 1),
(14, 'B', 2, 'AVAILABLE', 'VIP', 1),
(15, 'B', 3, 'AVAILABLE', 'VIP', 1),
(16, 'B', 4, 'AVAILABLE', 'VIP', 1),
(17, 'B', 5, 'AVAILABLE', 'VIP', 1),
(18, 'B', 6, 'AVAILABLE', 'VIP', 1),
(19, 'B', 7, 'AVAILABLE', 'VIP', 1),
(20, 'B', 8, 'AVAILABLE', 'VIP', 1),
(21, 'B', 9, 'AVAILABLE', 'VIP', 1),
(22, 'B', 10, 'AVAILABLE', 'VIP', 1),
(23, 'B', 11, 'AVAILABLE', 'VIP', 1),
(24, 'B', 12, 'AVAILABLE', 'COUPLE', 1),
(25, 'C', 1, 'AVAILABLE', 'COUPLE', 1),
(26, 'C', 2, 'AVAILABLE', 'STANDARD', 1),
(27, 'C', 3, 'AVAILABLE', 'STANDARD', 1),
(28, 'C', 4, 'AVAILABLE', 'STANDARD', 1),
(29, 'C', 5, 'AVAILABLE', 'STANDARD', 1),
(30, 'C', 6, 'AVAILABLE', 'STANDARD', 1),
(31, 'C', 7, 'AVAILABLE', 'STANDARD', 1),
(32, 'C', 8, 'AVAILABLE', 'STANDARD', 1),
(33, 'C', 9, 'AVAILABLE', 'STANDARD', 1),
(34, 'C', 10, 'AVAILABLE', 'STANDARD', 1),
(35, 'C', 11, 'AVAILABLE', 'STANDARD', 1),
(36, 'C', 12, 'AVAILABLE', 'COUPLE', 1),
(37, 'D', 1, 'AVAILABLE', 'COUPLE', 1),
(38, 'D', 2, 'AVAILABLE', 'STANDARD', 1),
(39, 'D', 3, 'AVAILABLE', 'STANDARD', 1),
(40, 'D', 4, 'AVAILABLE', 'STANDARD', 1),
(41, 'D', 5, 'AVAILABLE', 'STANDARD', 1),
(42, 'D', 6, 'AVAILABLE', 'STANDARD', 1),
(43, 'D', 7, 'AVAILABLE', 'STANDARD', 1),
(44, 'D', 8, 'AVAILABLE', 'STANDARD', 1),
(45, 'D', 9, 'AVAILABLE', 'STANDARD', 1),
(46, 'D', 10, 'AVAILABLE', 'STANDARD', 1),
(47, 'D', 11, 'AVAILABLE', 'STANDARD', 1),
(48, 'D', 12, 'AVAILABLE', 'COUPLE', 1),
(49, 'E', 1, 'AVAILABLE', 'COUPLE', 1),
(50, 'E', 2, 'AVAILABLE', 'STANDARD', 1),
(51, 'E', 3, 'AVAILABLE', 'STANDARD', 1),
(52, 'E', 4, 'AVAILABLE', 'STANDARD', 1),
(53, 'E', 5, 'AVAILABLE', 'STANDARD', 1),
(54, 'E', 6, 'AVAILABLE', 'STANDARD', 1),
(55, 'E', 7, 'AVAILABLE', 'STANDARD', 1),
(56, 'E', 8, 'AVAILABLE', 'STANDARD', 1),
(57, 'E', 9, 'AVAILABLE', 'STANDARD', 1),
(58, 'E', 10, 'AVAILABLE', 'STANDARD', 1),
(59, 'E', 11, 'AVAILABLE', 'STANDARD', 1),
(60, 'E', 12, 'AVAILABLE', 'COUPLE', 1),
(61, 'F', 1, 'AVAILABLE', 'COUPLE', 1),
(62, 'F', 2, 'AVAILABLE', 'STANDARD', 1),
(63, 'F', 3, 'AVAILABLE', 'STANDARD', 1),
(64, 'F', 4, 'AVAILABLE', 'STANDARD', 1),
(65, 'F', 5, 'AVAILABLE', 'STANDARD', 1),
(66, 'F', 6, 'AVAILABLE', 'STANDARD', 1),
(67, 'F', 7, 'AVAILABLE', 'STANDARD', 1),
(68, 'F', 8, 'AVAILABLE', 'STANDARD', 1),
(69, 'F', 9, 'AVAILABLE', 'STANDARD', 1),
(70, 'F', 10, 'AVAILABLE', 'STANDARD', 1),
(71, 'F', 11, 'AVAILABLE', 'STANDARD', 1),
(72, 'F', 12, 'AVAILABLE', 'COUPLE', 1),
(73, 'G', 1, 'AVAILABLE', 'COUPLE', 1),
(74, 'G', 2, 'AVAILABLE', 'STANDARD', 1),
(75, 'G', 3, 'AVAILABLE', 'STANDARD', 1),
(76, 'G', 4, 'AVAILABLE', 'STANDARD', 1),
(77, 'G', 5, 'AVAILABLE', 'STANDARD', 1),
(78, 'G', 6, 'AVAILABLE', 'STANDARD', 1),
(79, 'G', 7, 'AVAILABLE', 'STANDARD', 1),
(80, 'G', 8, 'AVAILABLE', 'STANDARD', 1),
(81, 'G', 9, 'AVAILABLE', 'STANDARD', 1),
(82, 'G', 10, 'AVAILABLE', 'STANDARD', 1),
(83, 'G', 11, 'AVAILABLE', 'STANDARD', 1),
(84, 'G', 12, 'AVAILABLE', 'COUPLE', 1),
(85, 'H', 1, 'AVAILABLE', 'COUPLE', 1),
(86, 'H', 2, 'AVAILABLE', 'STANDARD', 1),
(87, 'H', 3, 'AVAILABLE', 'STANDARD', 1),
(88, 'H', 4, 'AVAILABLE', 'STANDARD', 1),
(89, 'H', 5, 'AVAILABLE', 'STANDARD', 1),
(90, 'H', 6, 'AVAILABLE', 'STANDARD', 1),
(91, 'H', 7, 'AVAILABLE', 'STANDARD', 1),
(92, 'H', 8, 'AVAILABLE', 'STANDARD', 1),
(93, 'H', 9, 'AVAILABLE', 'STANDARD', 1),
(94, 'H', 10, 'AVAILABLE', 'STANDARD', 1),
(95, 'H', 11, 'AVAILABLE', 'STANDARD', 1),
(96, 'H', 12, 'AVAILABLE', 'COUPLE', 1),
(97, 'A', 3, 'AVAILABLE', 'STANDARD', 2),
(98, 'A', 6, 'AVAILABLE', 'STANDARD', 2),
(99, 'A', 2, 'AVAILABLE', 'STANDARD', 2),
(100, 'A', 1, 'AVAILABLE', 'STANDARD', 2),
(101, 'A', 4, 'AVAILABLE', 'STANDARD', 2),
(102, 'A', 5, 'AVAILABLE', 'STANDARD', 2),
(103, 'A', 7, 'AVAILABLE', 'STANDARD', 2),
(104, 'A', 8, 'AVAILABLE', 'STANDARD', 2),
(105, 'A', 10, 'AVAILABLE', 'STANDARD', 2),
(106, 'A', 9, 'AVAILABLE', 'STANDARD', 2),
(107, 'A', 11, 'AVAILABLE', 'STANDARD', 2),
(108, 'A', 12, 'AVAILABLE', 'STANDARD', 2),
(109, 'A', 13, 'AVAILABLE', 'STANDARD', 2),
(110, 'A', 14, 'AVAILABLE', 'STANDARD', 2),
(111, 'B', 1, 'AVAILABLE', 'STANDARD', 2),
(112, 'B', 3, 'AVAILABLE', 'STANDARD', 2),
(113, 'A', 15, 'AVAILABLE', 'STANDARD', 2),
(114, 'B', 2, 'AVAILABLE', 'STANDARD', 2),
(115, 'B', 4, 'AVAILABLE', 'STANDARD', 2),
(116, 'B', 5, 'AVAILABLE', 'STANDARD', 2),
(117, 'B', 6, 'AVAILABLE', 'STANDARD', 2),
(118, 'B', 7, 'AVAILABLE', 'STANDARD', 2),
(119, 'B', 9, 'AVAILABLE', 'STANDARD', 2),
(120, 'B', 8, 'AVAILABLE', 'STANDARD', 2),
(121, 'B', 10, 'AVAILABLE', 'STANDARD', 2),
(122, 'B', 11, 'AVAILABLE', 'STANDARD', 2),
(123, 'B', 12, 'AVAILABLE', 'STANDARD', 2),
(124, 'B', 14, 'AVAILABLE', 'STANDARD', 2),
(125, 'B', 15, 'AVAILABLE', 'STANDARD', 2),
(126, 'C', 1, 'AVAILABLE', 'STANDARD', 2),
(127, 'B', 13, 'AVAILABLE', 'STANDARD', 2),
(128, 'C', 2, 'AVAILABLE', 'STANDARD', 2),
(129, 'C', 3, 'AVAILABLE', 'STANDARD', 2),
(130, 'C', 4, 'AVAILABLE', 'STANDARD', 2),
(131, 'C', 6, 'AVAILABLE', 'STANDARD', 2),
(132, 'C', 7, 'AVAILABLE', 'STANDARD', 2),
(133, 'C', 5, 'AVAILABLE', 'STANDARD', 2),
(134, 'C', 8, 'AVAILABLE', 'STANDARD', 2),
(135, 'C', 9, 'AVAILABLE', 'STANDARD', 2),
(136, 'C', 11, 'AVAILABLE', 'STANDARD', 2),
(137, 'C', 13, 'AVAILABLE', 'STANDARD', 2),
(138, 'C', 10, 'AVAILABLE', 'STANDARD', 2),
(139, 'C', 14, 'AVAILABLE', 'STANDARD', 2),
(140, 'C', 12, 'AVAILABLE', 'STANDARD', 2),
(141, 'C', 15, 'AVAILABLE', 'STANDARD', 2),
(142, 'D', 1, 'AVAILABLE', 'VIP', 2),
(143, 'D', 4, 'AVAILABLE', 'VIP', 2),
(144, 'D', 3, 'AVAILABLE', 'VIP', 2),
(145, 'D', 5, 'AVAILABLE', 'VIP', 2),
(146, 'D', 2, 'AVAILABLE', 'VIP', 2),
(147, 'D', 6, 'AVAILABLE', 'VIP', 2),
(148, 'D', 7, 'AVAILABLE', 'VIP', 2),
(149, 'D', 10, 'AVAILABLE', 'VIP', 2),
(150, 'D', 8, 'AVAILABLE', 'VIP', 2),
(151, 'D', 9, 'AVAILABLE', 'VIP', 2),
(152, 'D', 12, 'AVAILABLE', 'VIP', 2),
(153, 'D', 11, 'AVAILABLE', 'VIP', 2),
(154, 'D', 13, 'AVAILABLE', 'VIP', 2),
(155, 'D', 14, 'AVAILABLE', 'VIP', 2),
(156, 'D', 15, 'AVAILABLE', 'VIP', 2),
(157, 'E', 3, 'AVAILABLE', 'VIP', 2),
(158, 'E', 2, 'AVAILABLE', 'VIP', 2),
(159, 'E', 1, 'AVAILABLE', 'VIP', 2),
(160, 'E', 4, 'AVAILABLE', 'VIP', 2),
(161, 'E', 5, 'AVAILABLE', 'VIP', 2),
(162, 'E', 6, 'AVAILABLE', 'VIP', 2),
(163, 'E', 7, 'AVAILABLE', 'VIP', 2),
(164, 'E', 8, 'AVAILABLE', 'VIP', 2),
(165, 'E', 9, 'AVAILABLE', 'VIP', 2),
(166, 'E', 10, 'AVAILABLE', 'VIP', 2),
(167, 'E', 12, 'AVAILABLE', 'VIP', 2),
(168, 'E', 11, 'AVAILABLE', 'VIP', 2),
(169, 'E', 14, 'AVAILABLE', 'VIP', 2),
(170, 'E', 13, 'AVAILABLE', 'VIP', 2),
(171, 'E', 15, 'AVAILABLE', 'VIP', 2),
(172, 'F', 3, 'AVAILABLE', 'VIP', 2),
(173, 'F', 2, 'AVAILABLE', 'VIP', 2),
(174, 'F', 1, 'AVAILABLE', 'VIP', 2),
(175, 'F', 4, 'AVAILABLE', 'VIP', 2),
(176, 'F', 5, 'AVAILABLE', 'VIP', 2),
(177, 'F', 6, 'AVAILABLE', 'VIP', 2),
(178, 'F', 8, 'AVAILABLE', 'VIP', 2),
(179, 'F', 7, 'AVAILABLE', 'VIP', 2),
(180, 'F', 9, 'AVAILABLE', 'VIP', 2),
(181, 'F', 10, 'AVAILABLE', 'VIP', 2),
(182, 'F', 11, 'AVAILABLE', 'VIP', 2),
(183, 'F', 12, 'AVAILABLE', 'VIP', 2),
(184, 'F', 13, 'AVAILABLE', 'VIP', 2),
(185, 'F', 14, 'AVAILABLE', 'VIP', 2),
(186, 'F', 15, 'AVAILABLE', 'VIP', 2),
(187, 'G', 1, 'AVAILABLE', 'VIP', 2),
(188, 'G', 3, 'AVAILABLE', 'VIP', 2),
(189, 'G', 2, 'AVAILABLE', 'VIP', 2),
(190, 'G', 4, 'AVAILABLE', 'VIP', 2),
(191, 'G', 5, 'AVAILABLE', 'VIP', 2),
(192, 'G', 6, 'AVAILABLE', 'VIP', 2),
(193, 'G', 8, 'AVAILABLE', 'VIP', 2),
(194, 'G', 9, 'AVAILABLE', 'VIP', 2),
(195, 'G', 7, 'AVAILABLE', 'VIP', 2),
(196, 'G', 10, 'AVAILABLE', 'VIP', 2),
(197, 'G', 11, 'AVAILABLE', 'VIP', 2),
(198, 'G', 12, 'AVAILABLE', 'VIP', 2),
(199, 'G', 15, 'AVAILABLE', 'VIP', 2),
(200, 'G', 13, 'AVAILABLE', 'VIP', 2),
(201, 'G', 14, 'AVAILABLE', 'VIP', 2),
(202, 'H', 1, 'AVAILABLE', 'VIP', 2),
(203, 'H', 2, 'AVAILABLE', 'VIP', 2),
(204, 'H', 3, 'AVAILABLE', 'VIP', 2),
(205, 'H', 6, 'AVAILABLE', 'VIP', 2),
(206, 'H', 5, 'AVAILABLE', 'VIP', 2),
(207, 'H', 4, 'AVAILABLE', 'VIP', 2),
(208, 'H', 8, 'AVAILABLE', 'VIP', 2),
(209, 'H', 7, 'AVAILABLE', 'VIP', 2),
(210, 'H', 10, 'AVAILABLE', 'VIP', 2),
(211, 'H', 9, 'AVAILABLE', 'VIP', 2),
(212, 'H', 11, 'AVAILABLE', 'VIP', 2),
(213, 'H', 12, 'AVAILABLE', 'VIP', 2),
(214, 'H', 14, 'AVAILABLE', 'VIP', 2),
(215, 'H', 13, 'AVAILABLE', 'VIP', 2),
(216, 'H', 15, 'AVAILABLE', 'VIP', 2),
(217, 'I', 1, 'AVAILABLE', 'VIP', 2),
(218, 'I', 2, 'AVAILABLE', 'VIP', 2),
(219, 'I', 3, 'AVAILABLE', 'VIP', 2),
(220, 'I', 5, 'AVAILABLE', 'VIP', 2),
(221, 'I', 4, 'AVAILABLE', 'VIP', 2),
(222, 'I', 6, 'AVAILABLE', 'VIP', 2),
(223, 'I', 8, 'AVAILABLE', 'VIP', 2),
(224, 'I', 7, 'AVAILABLE', 'VIP', 2),
(225, 'I', 9, 'AVAILABLE', 'VIP', 2),
(226, 'I', 11, 'AVAILABLE', 'VIP', 2),
(227, 'I', 10, 'AVAILABLE', 'VIP', 2),
(228, 'I', 12, 'AVAILABLE', 'VIP', 2),
(229, 'I', 15, 'AVAILABLE', 'VIP', 2),
(230, 'I', 13, 'AVAILABLE', 'VIP', 2),
(231, 'I', 14, 'AVAILABLE', 'VIP', 2),
(232, 'J', 1, 'AVAILABLE', 'COUPLE', 2),
(233, 'J', 2, 'AVAILABLE', 'COUPLE', 2),
(234, 'J', 3, 'AVAILABLE', 'COUPLE', 2),
(235, 'J', 5, 'AVAILABLE', 'COUPLE', 2),
(236, 'J', 4, 'AVAILABLE', 'COUPLE', 2),
(237, 'J', 6, 'AVAILABLE', 'COUPLE', 2),
(238, 'J', 7, 'AVAILABLE', 'COUPLE', 2),
(239, 'A', 1, 'AVAILABLE', 'STANDARD', 3),
(240, 'A', 2, 'AVAILABLE', 'STANDARD', 3),
(241, 'A', 3, 'AVAILABLE', 'STANDARD', 3),
(242, 'A', 5, 'AVAILABLE', 'STANDARD', 3),
(243, 'A', 4, 'AVAILABLE', 'STANDARD', 3),
(244, 'A', 6, 'AVAILABLE', 'STANDARD', 3),
(245, 'A', 7, 'AVAILABLE', 'STANDARD', 3),
(246, 'A', 8, 'AVAILABLE', 'STANDARD', 3),
(247, 'A', 9, 'AVAILABLE', 'STANDARD', 3),
(248, 'A', 10, 'AVAILABLE', 'STANDARD', 3),
(249, 'B', 1, 'AVAILABLE', 'STANDARD', 3),
(250, 'B', 2, 'AVAILABLE', 'STANDARD', 3),
(251, 'B', 3, 'AVAILABLE', 'STANDARD', 3),
(252, 'B', 4, 'AVAILABLE', 'STANDARD', 3),
(253, 'B', 5, 'AVAILABLE', 'STANDARD', 3),
(254, 'B', 6, 'AVAILABLE', 'STANDARD', 3),
(255, 'B', 7, 'AVAILABLE', 'STANDARD', 3),
(256, 'B', 9, 'AVAILABLE', 'STANDARD', 3),
(257, 'B', 10, 'AVAILABLE', 'STANDARD', 3),
(258, 'B', 8, 'AVAILABLE', 'STANDARD', 3),
(259, 'C', 1, 'AVAILABLE', 'STANDARD', 3),
(260, 'C', 2, 'AVAILABLE', 'STANDARD', 3),
(261, 'C', 3, 'AVAILABLE', 'STANDARD', 3),
(262, 'C', 4, 'AVAILABLE', 'STANDARD', 3),
(263, 'C', 6, 'AVAILABLE', 'STANDARD', 3),
(264, 'C', 5, 'AVAILABLE', 'STANDARD', 3),
(265, 'C', 8, 'AVAILABLE', 'STANDARD', 3),
(266, 'C', 7, 'AVAILABLE', 'STANDARD', 3),
(267, 'C', 9, 'AVAILABLE', 'STANDARD', 3),
(268, 'C', 10, 'AVAILABLE', 'STANDARD', 3),
(269, 'D', 1, 'AVAILABLE', 'VIP', 3),
(270, 'D', 2, 'AVAILABLE', 'VIP', 3),
(271, 'D', 4, 'AVAILABLE', 'VIP', 3),
(272, 'D', 3, 'AVAILABLE', 'VIP', 3),
(273, 'D', 5, 'AVAILABLE', 'VIP', 3),
(274, 'D', 8, 'AVAILABLE', 'VIP', 3),
(275, 'D', 6, 'AVAILABLE', 'VIP', 3),
(276, 'D', 7, 'AVAILABLE', 'VIP', 3),
(277, 'D', 9, 'AVAILABLE', 'VIP', 3),
(278, 'E', 1, 'AVAILABLE', 'VIP', 3),
(279, 'D', 10, 'AVAILABLE', 'VIP', 3),
(280, 'E', 2, 'AVAILABLE', 'VIP', 3),
(281, 'E', 3, 'AVAILABLE', 'VIP', 3),
(282, 'E', 4, 'AVAILABLE', 'VIP', 3),
(283, 'E', 5, 'AVAILABLE', 'VIP', 3),
(284, 'E', 6, 'AVAILABLE', 'VIP', 3),
(285, 'E', 7, 'AVAILABLE', 'VIP', 3),
(286, 'E', 8, 'AVAILABLE', 'VIP', 3),
(287, 'E', 10, 'AVAILABLE', 'VIP', 3),
(288, 'E', 9, 'AVAILABLE', 'VIP', 3),
(289, 'F', 1, 'AVAILABLE', 'VIP', 3),
(290, 'F', 2, 'AVAILABLE', 'VIP', 3),
(291, 'F', 4, 'AVAILABLE', 'VIP', 3),
(292, 'F', 5, 'AVAILABLE', 'VIP', 3),
(293, 'F', 3, 'AVAILABLE', 'VIP', 3),
(294, 'F', 7, 'AVAILABLE', 'VIP', 3),
(295, 'F', 6, 'AVAILABLE', 'VIP', 3),
(296, 'F', 8, 'AVAILABLE', 'VIP', 3),
(297, 'F', 9, 'AVAILABLE', 'VIP', 3),
(298, 'G', 2, 'AVAILABLE', 'VIP', 3),
(299, 'G', 3, 'AVAILABLE', 'VIP', 3),
(300, 'G', 1, 'AVAILABLE', 'VIP', 3),
(301, 'F', 10, 'AVAILABLE', 'VIP', 3),
(302, 'G', 4, 'AVAILABLE', 'VIP', 3),
(303, 'G', 5, 'AVAILABLE', 'VIP', 3),
(304, 'G', 7, 'AVAILABLE', 'VIP', 3),
(305, 'G', 8, 'AVAILABLE', 'VIP', 3),
(306, 'G', 9, 'AVAILABLE', 'VIP', 3),
(307, 'G', 6, 'AVAILABLE', 'VIP', 3),
(308, 'G', 10, 'AVAILABLE', 'VIP', 3),
(309, 'H', 1, 'AVAILABLE', 'VIP', 3),
(310, 'H', 2, 'AVAILABLE', 'VIP', 3),
(311, 'H', 4, 'AVAILABLE', 'VIP', 3),
(312, 'H', 3, 'AVAILABLE', 'VIP', 3),
(313, 'H', 5, 'AVAILABLE', 'VIP', 3),
(314, 'H', 7, 'AVAILABLE', 'VIP', 3),
(315, 'H', 6, 'AVAILABLE', 'VIP', 3),
(316, 'H', 8, 'AVAILABLE', 'VIP', 3),
(317, 'H', 9, 'AVAILABLE', 'VIP', 3),
(318, 'H', 10, 'AVAILABLE', 'VIP', 3),
(319, 'I', 1, 'AVAILABLE', 'VIP', 3),
(320, 'I', 3, 'AVAILABLE', 'VIP', 3),
(321, 'I', 2, 'AVAILABLE', 'VIP', 3),
(322, 'I', 4, 'AVAILABLE', 'VIP', 3),
(323, 'I', 5, 'AVAILABLE', 'VIP', 3),
(324, 'I', 6, 'AVAILABLE', 'VIP', 3),
(325, 'I', 7, 'AVAILABLE', 'VIP', 3),
(326, 'I', 8, 'AVAILABLE', 'VIP', 3),
(327, 'I', 9, 'AVAILABLE', 'VIP', 3),
(328, 'I', 10, 'AVAILABLE', 'VIP', 3),
(329, 'J', 1, 'AVAILABLE', 'COUPLE', 3),
(330, 'J', 4, 'AVAILABLE', 'COUPLE', 3),
(331, 'J', 3, 'AVAILABLE', 'COUPLE', 3),
(332, 'J', 5, 'AVAILABLE', 'COUPLE', 3),
(333, 'J', 2, 'AVAILABLE', 'COUPLE', 3),
(334, 'A', 2, 'AVAILABLE', 'STANDARD', 4),
(335, 'A', 1, 'AVAILABLE', 'STANDARD', 4),
(336, 'A', 3, 'AVAILABLE', 'STANDARD', 4),
(337, 'A', 4, 'AVAILABLE', 'STANDARD', 4),
(338, 'A', 6, 'AVAILABLE', 'STANDARD', 4),
(339, 'A', 5, 'AVAILABLE', 'STANDARD', 4),
(340, 'A', 7, 'AVAILABLE', 'STANDARD', 4),
(341, 'A', 10, 'AVAILABLE', 'STANDARD', 4),
(342, 'A', 9, 'AVAILABLE', 'STANDARD', 4),
(343, 'A', 11, 'AVAILABLE', 'STANDARD', 4),
(344, 'A', 8, 'AVAILABLE', 'STANDARD', 4),
(345, 'B', 1, 'AVAILABLE', 'STANDARD', 4),
(346, 'A', 12, 'AVAILABLE', 'STANDARD', 4),
(347, 'B', 2, 'AVAILABLE', 'STANDARD', 4),
(348, 'B', 3, 'AVAILABLE', 'STANDARD', 4),
(349, 'B', 4, 'AVAILABLE', 'STANDARD', 4),
(350, 'B', 5, 'AVAILABLE', 'STANDARD', 4),
(351, 'B', 6, 'AVAILABLE', 'STANDARD', 4),
(352, 'B', 8, 'AVAILABLE', 'STANDARD', 4),
(353, 'B', 7, 'AVAILABLE', 'STANDARD', 4),
(354, 'B', 10, 'AVAILABLE', 'STANDARD', 4),
(355, 'B', 9, 'AVAILABLE', 'STANDARD', 4),
(356, 'B', 12, 'AVAILABLE', 'STANDARD', 4),
(357, 'B', 11, 'AVAILABLE', 'STANDARD', 4),
(358, 'C', 4, 'AVAILABLE', 'STANDARD', 4),
(359, 'C', 1, 'AVAILABLE', 'STANDARD', 4),
(360, 'C', 3, 'AVAILABLE', 'STANDARD', 4),
(361, 'C', 2, 'AVAILABLE', 'STANDARD', 4),
(362, 'C', 5, 'AVAILABLE', 'STANDARD', 4),
(363, 'C', 6, 'AVAILABLE', 'STANDARD', 4),
(364, 'C', 9, 'AVAILABLE', 'STANDARD', 4),
(365, 'C', 7, 'AVAILABLE', 'STANDARD', 4),
(366, 'C', 8, 'AVAILABLE', 'STANDARD', 4),
(367, 'C', 10, 'AVAILABLE', 'STANDARD', 4),
(368, 'C', 11, 'AVAILABLE', 'STANDARD', 4),
(369, 'C', 12, 'AVAILABLE', 'STANDARD', 4),
(370, 'D', 1, 'AVAILABLE', 'VIP', 4),
(371, 'D', 3, 'AVAILABLE', 'VIP', 4),
(372, 'D', 2, 'AVAILABLE', 'VIP', 4),
(373, 'D', 4, 'AVAILABLE', 'VIP', 4),
(374, 'D', 5, 'AVAILABLE', 'VIP', 4),
(375, 'D', 6, 'AVAILABLE', 'VIP', 4),
(376, 'D', 7, 'AVAILABLE', 'VIP', 4),
(377, 'D', 8, 'AVAILABLE', 'VIP', 4),
(378, 'D', 9, 'AVAILABLE', 'VIP', 4),
(379, 'D', 10, 'AVAILABLE', 'VIP', 4),
(380, 'D', 11, 'AVAILABLE', 'VIP', 4),
(381, 'D', 12, 'AVAILABLE', 'VIP', 4),
(382, 'E', 2, 'AVAILABLE', 'VIP', 4),
(383, 'E', 1, 'AVAILABLE', 'VIP', 4),
(384, 'E', 3, 'AVAILABLE', 'VIP', 4),
(385, 'E', 5, 'AVAILABLE', 'VIP', 4),
(386, 'E', 4, 'AVAILABLE', 'VIP', 4),
(387, 'E', 6, 'AVAILABLE', 'VIP', 4),
(388, 'E', 7, 'AVAILABLE', 'VIP', 4),
(389, 'E', 8, 'AVAILABLE', 'VIP', 4),
(390, 'E', 9, 'AVAILABLE', 'VIP', 4),
(391, 'E', 10, 'AVAILABLE', 'VIP', 4),
(392, 'E', 11, 'AVAILABLE', 'VIP', 4),
(393, 'E', 12, 'AVAILABLE', 'VIP', 4),
(394, 'F', 3, 'AVAILABLE', 'VIP', 4),
(395, 'F', 2, 'AVAILABLE', 'VIP', 4),
(396, 'F', 1, 'AVAILABLE', 'VIP', 4),
(397, 'F', 4, 'AVAILABLE', 'VIP', 4),
(398, 'F', 5, 'AVAILABLE', 'VIP', 4),
(399, 'F', 6, 'AVAILABLE', 'VIP', 4),
(400, 'F', 9, 'AVAILABLE', 'VIP', 4),
(401, 'F', 7, 'AVAILABLE', 'VIP', 4),
(402, 'F', 8, 'AVAILABLE', 'VIP', 4),
(403, 'F', 10, 'AVAILABLE', 'VIP', 4),
(404, 'F', 11, 'AVAILABLE', 'VIP', 4),
(405, 'G', 1, 'AVAILABLE', 'VIP', 4),
(406, 'F', 12, 'AVAILABLE', 'VIP', 4),
(407, 'G', 2, 'AVAILABLE', 'VIP', 4),
(408, 'G', 3, 'AVAILABLE', 'VIP', 4),
(409, 'G', 4, 'AVAILABLE', 'VIP', 4),
(410, 'G', 5, 'AVAILABLE', 'VIP', 4),
(411, 'G', 6, 'AVAILABLE', 'VIP', 4),
(412, 'G', 8, 'AVAILABLE', 'VIP', 4),
(413, 'G', 7, 'AVAILABLE', 'VIP', 4),
(414, 'G', 9, 'AVAILABLE', 'VIP', 4),
(415, 'G', 10, 'AVAILABLE', 'VIP', 4),
(416, 'G', 11, 'AVAILABLE', 'VIP', 4),
(417, 'G', 12, 'AVAILABLE', 'VIP', 4),
(418, 'H', 2, 'AVAILABLE', 'VIP', 4),
(419, 'H', 1, 'AVAILABLE', 'VIP', 4),
(420, 'H', 5, 'AVAILABLE', 'VIP', 4),
(421, 'H', 3, 'AVAILABLE', 'VIP', 4),
(422, 'H', 4, 'AVAILABLE', 'VIP', 4),
(423, 'H', 6, 'AVAILABLE', 'VIP', 4),
(424, 'H', 7, 'AVAILABLE', 'VIP', 4),
(425, 'H', 8, 'AVAILABLE', 'VIP', 4),
(426, 'H', 12, 'AVAILABLE', 'VIP', 4),
(427, 'H', 10, 'AVAILABLE', 'VIP', 4),
(428, 'H', 11, 'AVAILABLE', 'VIP', 4),
(429, 'H', 9, 'AVAILABLE', 'VIP', 4),
(430, 'I', 1, 'AVAILABLE', 'VIP', 4),
(431, 'I', 2, 'AVAILABLE', 'VIP', 4),
(432, 'I', 5, 'AVAILABLE', 'VIP', 4),
(433, 'I', 3, 'AVAILABLE', 'VIP', 4),
(434, 'I', 6, 'AVAILABLE', 'VIP', 4),
(435, 'I', 4, 'AVAILABLE', 'VIP', 4),
(436, 'I', 8, 'AVAILABLE', 'VIP', 4),
(437, 'I', 7, 'AVAILABLE', 'VIP', 4),
(438, 'I', 9, 'AVAILABLE', 'VIP', 4),
(439, 'I', 12, 'AVAILABLE', 'VIP', 4),
(440, 'I', 11, 'AVAILABLE', 'VIP', 4),
(441, 'I', 10, 'AVAILABLE', 'VIP', 4),
(442, 'J', 1, 'AVAILABLE', 'COUPLE', 4),
(443, 'J', 2, 'AVAILABLE', 'COUPLE', 4),
(444, 'J', 3, 'AVAILABLE', 'COUPLE', 4),
(445, 'J', 6, 'AVAILABLE', 'COUPLE', 4),
(446, 'J', 5, 'AVAILABLE', 'COUPLE', 4),
(447, 'J', 4, 'AVAILABLE', 'COUPLE', 4),
(448, 'A', 1, 'AVAILABLE', 'STANDARD', 5),
(449, 'A', 2, 'AVAILABLE', 'STANDARD', 5),
(450, 'A', 3, 'AVAILABLE', 'STANDARD', 5),
(451, 'A', 5, 'AVAILABLE', 'STANDARD', 5),
(452, 'A', 4, 'AVAILABLE', 'STANDARD', 5),
(453, 'A', 6, 'AVAILABLE', 'STANDARD', 5),
(454, 'A', 7, 'AVAILABLE', 'STANDARD', 5),
(455, 'A', 8, 'AVAILABLE', 'STANDARD', 5),
(456, 'A', 10, 'AVAILABLE', 'STANDARD', 5),
(457, 'A', 9, 'AVAILABLE', 'STANDARD', 5),
(458, 'B', 1, 'AVAILABLE', 'VIP', 5),
(459, 'B', 2, 'AVAILABLE', 'VIP', 5),
(460, 'B', 3, 'AVAILABLE', 'VIP', 5),
(461, 'B', 4, 'AVAILABLE', 'VIP', 5),
(462, 'B', 5, 'AVAILABLE', 'VIP', 5),
(463, 'B', 6, 'AVAILABLE', 'VIP', 5),
(464, 'B', 8, 'AVAILABLE', 'VIP', 5),
(465, 'B', 7, 'AVAILABLE', 'VIP', 5),
(466, 'B', 9, 'AVAILABLE', 'VIP', 5),
(467, 'B', 10, 'AVAILABLE', 'VIP', 5),
(468, 'C', 1, 'AVAILABLE', 'VIP', 5),
(469, 'C', 2, 'AVAILABLE', 'VIP', 5),
(470, 'C', 3, 'AVAILABLE', 'VIP', 5),
(471, 'C', 4, 'AVAILABLE', 'VIP', 5),
(472, 'C', 5, 'AVAILABLE', 'VIP', 5),
(473, 'C', 6, 'AVAILABLE', 'VIP', 5),
(474, 'C', 7, 'AVAILABLE', 'VIP', 5),
(475, 'C', 8, 'AVAILABLE', 'VIP', 5),
(476, 'C', 10, 'AVAILABLE', 'VIP', 5),
(477, 'C', 9, 'AVAILABLE', 'VIP', 5),
(478, 'D', 1, 'AVAILABLE', 'VIP', 5),
(479, 'D', 2, 'AVAILABLE', 'VIP', 5),
(480, 'D', 3, 'AVAILABLE', 'VIP', 5),
(481, 'D', 4, 'AVAILABLE', 'VIP', 5),
(482, 'D', 5, 'AVAILABLE', 'VIP', 5),
(483, 'D', 8, 'AVAILABLE', 'VIP', 5),
(484, 'D', 6, 'AVAILABLE', 'VIP', 5),
(485, 'D', 7, 'AVAILABLE', 'VIP', 5),
(486, 'D', 9, 'AVAILABLE', 'VIP', 5),
(487, 'D', 10, 'AVAILABLE', 'VIP', 5),
(488, 'E', 1, 'AVAILABLE', 'COUPLE', 5),
(489, 'E', 3, 'AVAILABLE', 'COUPLE', 5),
(490, 'E', 2, 'AVAILABLE', 'COUPLE', 5),
(491, 'E', 4, 'AVAILABLE', 'COUPLE', 5),
(492, 'E', 5, 'AVAILABLE', 'COUPLE', 5),
(493, 'A', 2, 'AVAILABLE', 'STANDARD', 6),
(494, 'A', 3, 'AVAILABLE', 'STANDARD', 6),
(495, 'A', 4, 'AVAILABLE', 'STANDARD', 6),
(496, 'A', 1, 'AVAILABLE', 'STANDARD', 6),
(497, 'A', 6, 'AVAILABLE', 'STANDARD', 6),
(498, 'A', 5, 'AVAILABLE', 'STANDARD', 6),
(499, 'A', 8, 'AVAILABLE', 'STANDARD', 6),
(500, 'A', 7, 'AVAILABLE', 'STANDARD', 6),
(501, 'A', 9, 'AVAILABLE', 'STANDARD', 6),
(502, 'A', 10, 'AVAILABLE', 'STANDARD', 6),
(503, 'B', 1, 'AVAILABLE', 'STANDARD', 6),
(504, 'B', 2, 'AVAILABLE', 'STANDARD', 6),
(505, 'B', 3, 'AVAILABLE', 'STANDARD', 6),
(506, 'B', 4, 'AVAILABLE', 'STANDARD', 6),
(507, 'B', 5, 'AVAILABLE', 'STANDARD', 6),
(508, 'B', 6, 'AVAILABLE', 'STANDARD', 6),
(509, 'B', 7, 'AVAILABLE', 'STANDARD', 6),
(510, 'B', 8, 'AVAILABLE', 'STANDARD', 6),
(511, 'B', 9, 'AVAILABLE', 'STANDARD', 6),
(512, 'B', 10, 'AVAILABLE', 'STANDARD', 6),
(513, 'C', 1, 'AVAILABLE', 'STANDARD', 6),
(514, 'C', 2, 'AVAILABLE', 'STANDARD', 6),
(515, 'C', 3, 'AVAILABLE', 'STANDARD', 6),
(516, 'C', 5, 'AVAILABLE', 'STANDARD', 6),
(517, 'C', 6, 'AVAILABLE', 'STANDARD', 6),
(518, 'C', 4, 'AVAILABLE', 'STANDARD', 6),
(519, 'C', 7, 'AVAILABLE', 'STANDARD', 6),
(520, 'C', 8, 'AVAILABLE', 'STANDARD', 6),
(521, 'C', 9, 'AVAILABLE', 'STANDARD', 6),
(522, 'C', 10, 'AVAILABLE', 'STANDARD', 6),
(523, 'D', 1, 'AVAILABLE', 'VIP', 6),
(524, 'D', 3, 'AVAILABLE', 'VIP', 6),
(525, 'D', 2, 'AVAILABLE', 'VIP', 6),
(526, 'D', 4, 'AVAILABLE', 'VIP', 6),
(527, 'D', 5, 'AVAILABLE', 'VIP', 6),
(528, 'D', 8, 'AVAILABLE', 'VIP', 6),
(529, 'D', 6, 'AVAILABLE', 'VIP', 6),
(530, 'D', 7, 'AVAILABLE', 'VIP', 6),
(531, 'D', 9, 'AVAILABLE', 'VIP', 6),
(532, 'D', 10, 'AVAILABLE', 'VIP', 6),
(533, 'E', 1, 'AVAILABLE', 'VIP', 6),
(534, 'E', 2, 'AVAILABLE', 'VIP', 6),
(535, 'E', 5, 'AVAILABLE', 'VIP', 6),
(536, 'E', 4, 'AVAILABLE', 'VIP', 6),
(537, 'E', 3, 'AVAILABLE', 'VIP', 6),
(538, 'E', 6, 'AVAILABLE', 'VIP', 6),
(539, 'E', 7, 'AVAILABLE', 'VIP', 6),
(540, 'E', 8, 'AVAILABLE', 'VIP', 6),
(541, 'E', 9, 'AVAILABLE', 'VIP', 6),
(542, 'E', 10, 'AVAILABLE', 'VIP', 6),
(543, 'F', 1, 'AVAILABLE', 'VIP', 6),
(544, 'F', 2, 'AVAILABLE', 'VIP', 6),
(545, 'F', 3, 'AVAILABLE', 'VIP', 6),
(546, 'F', 4, 'AVAILABLE', 'VIP', 6),
(547, 'F', 5, 'AVAILABLE', 'VIP', 6),
(548, 'F', 6, 'AVAILABLE', 'VIP', 6),
(549, 'F', 7, 'AVAILABLE', 'VIP', 6),
(550, 'F', 9, 'AVAILABLE', 'VIP', 6),
(551, 'F', 8, 'AVAILABLE', 'VIP', 6),
(552, 'F', 10, 'AVAILABLE', 'VIP', 6),
(553, 'G', 1, 'AVAILABLE', 'VIP', 6),
(554, 'G', 2, 'AVAILABLE', 'VIP', 6),
(555, 'G', 4, 'AVAILABLE', 'VIP', 6),
(556, 'G', 3, 'AVAILABLE', 'VIP', 6),
(557, 'G', 7, 'AVAILABLE', 'VIP', 6),
(558, 'G', 6, 'AVAILABLE', 'VIP', 6),
(559, 'G', 5, 'AVAILABLE', 'VIP', 6),
(560, 'G', 8, 'AVAILABLE', 'VIP', 6),
(561, 'G', 9, 'AVAILABLE', 'VIP', 6),
(562, 'H', 3, 'AVAILABLE', 'VIP', 6),
(563, 'H', 1, 'AVAILABLE', 'VIP', 6),
(564, 'H', 2, 'AVAILABLE', 'VIP', 6),
(565, 'G', 10, 'AVAILABLE', 'VIP', 6),
(566, 'H', 4, 'AVAILABLE', 'VIP', 6),
(567, 'H', 5, 'AVAILABLE', 'VIP', 6),
(568, 'H', 6, 'AVAILABLE', 'VIP', 6),
(569, 'H', 7, 'AVAILABLE', 'VIP', 6),
(570, 'H', 8, 'AVAILABLE', 'VIP', 6),
(571, 'H', 9, 'AVAILABLE', 'VIP', 6),
(572, 'H', 10, 'AVAILABLE', 'VIP', 6),
(573, 'I', 1, 'AVAILABLE', 'VIP', 6),
(574, 'I', 2, 'AVAILABLE', 'VIP', 6),
(575, 'I', 3, 'AVAILABLE', 'VIP', 6),
(576, 'I', 4, 'AVAILABLE', 'VIP', 6),
(577, 'I', 5, 'AVAILABLE', 'VIP', 6),
(578, 'I', 7, 'AVAILABLE', 'VIP', 6),
(579, 'I', 6, 'AVAILABLE', 'VIP', 6),
(580, 'I', 9, 'AVAILABLE', 'VIP', 6),
(581, 'I', 8, 'AVAILABLE', 'VIP', 6),
(582, 'I', 10, 'AVAILABLE', 'VIP', 6),
(583, 'J', 1, 'AVAILABLE', 'COUPLE', 6),
(584, 'J', 2, 'AVAILABLE', 'COUPLE', 6),
(585, 'J', 3, 'AVAILABLE', 'COUPLE', 6),
(586, 'J', 4, 'AVAILABLE', 'COUPLE', 6),
(587, 'J', 5, 'AVAILABLE', 'COUPLE', 6),
(588, 'A', 2, 'AVAILABLE', 'STANDARD', 7),
(589, 'A', 1, 'AVAILABLE', 'STANDARD', 7),
(590, 'A', 3, 'AVAILABLE', 'STANDARD', 7),
(591, 'A', 4, 'AVAILABLE', 'STANDARD', 7),
(592, 'A', 5, 'AVAILABLE', 'STANDARD', 7),
(593, 'A', 6, 'AVAILABLE', 'STANDARD', 7),
(594, 'A', 7, 'AVAILABLE', 'STANDARD', 7),
(595, 'A', 9, 'AVAILABLE', 'STANDARD', 7),
(596, 'A', 8, 'AVAILABLE', 'STANDARD', 7),
(597, 'B', 1, 'AVAILABLE', 'STANDARD', 7),
(598, 'A', 10, 'AVAILABLE', 'STANDARD', 7),
(599, 'B', 2, 'AVAILABLE', 'STANDARD', 7),
(600, 'B', 3, 'AVAILABLE', 'STANDARD', 7),
(601, 'B', 4, 'AVAILABLE', 'STANDARD', 7),
(602, 'B', 7, 'AVAILABLE', 'STANDARD', 7),
(603, 'B', 5, 'AVAILABLE', 'STANDARD', 7),
(604, 'B', 6, 'AVAILABLE', 'STANDARD', 7),
(605, 'B', 8, 'AVAILABLE', 'STANDARD', 7),
(606, 'B', 9, 'AVAILABLE', 'STANDARD', 7),
(607, 'B', 10, 'AVAILABLE', 'STANDARD', 7),
(608, 'C', 1, 'AVAILABLE', 'STANDARD', 7),
(609, 'C', 2, 'AVAILABLE', 'STANDARD', 7),
(610, 'C', 4, 'AVAILABLE', 'STANDARD', 7),
(611, 'C', 3, 'AVAILABLE', 'STANDARD', 7),
(612, 'C', 5, 'AVAILABLE', 'STANDARD', 7),
(613, 'C', 6, 'AVAILABLE', 'STANDARD', 7),
(614, 'C', 7, 'AVAILABLE', 'STANDARD', 7),
(615, 'C', 8, 'AVAILABLE', 'STANDARD', 7),
(616, 'C', 9, 'AVAILABLE', 'STANDARD', 7),
(617, 'D', 1, 'AVAILABLE', 'VIP', 7),
(618, 'C', 10, 'AVAILABLE', 'STANDARD', 7),
(619, 'D', 2, 'AVAILABLE', 'VIP', 7),
(620, 'D', 3, 'AVAILABLE', 'VIP', 7),
(621, 'D', 4, 'AVAILABLE', 'VIP', 7),
(622, 'D', 6, 'AVAILABLE', 'VIP', 7),
(623, 'D', 7, 'AVAILABLE', 'VIP', 7),
(624, 'D', 5, 'AVAILABLE', 'VIP', 7),
(625, 'D', 8, 'AVAILABLE', 'VIP', 7),
(626, 'D', 9, 'AVAILABLE', 'VIP', 7),
(627, 'D', 10, 'AVAILABLE', 'VIP', 7),
(628, 'E', 1, 'AVAILABLE', 'VIP', 7),
(629, 'E', 2, 'AVAILABLE', 'VIP', 7),
(630, 'E', 3, 'AVAILABLE', 'VIP', 7),
(631, 'E', 4, 'AVAILABLE', 'VIP', 7),
(632, 'E', 5, 'AVAILABLE', 'VIP', 7),
(633, 'E', 6, 'AVAILABLE', 'VIP', 7),
(634, 'E', 7, 'AVAILABLE', 'VIP', 7),
(635, 'E', 8, 'AVAILABLE', 'VIP', 7),
(636, 'E', 9, 'AVAILABLE', 'VIP', 7),
(637, 'E', 10, 'AVAILABLE', 'VIP', 7),
(638, 'F', 2, 'AVAILABLE', 'VIP', 7),
(639, 'F', 1, 'AVAILABLE', 'VIP', 7),
(640, 'F', 3, 'AVAILABLE', 'VIP', 7),
(641, 'F', 5, 'AVAILABLE', 'VIP', 7),
(642, 'F', 4, 'AVAILABLE', 'VIP', 7),
(643, 'F', 6, 'AVAILABLE', 'VIP', 7),
(644, 'F', 7, 'AVAILABLE', 'VIP', 7),
(645, 'F', 8, 'AVAILABLE', 'VIP', 7),
(646, 'F', 9, 'AVAILABLE', 'VIP', 7),
(647, 'F', 10, 'AVAILABLE', 'VIP', 7),
(648, 'G', 1, 'AVAILABLE', 'VIP', 7),
(649, 'G', 4, 'AVAILABLE', 'VIP', 7),
(650, 'G', 2, 'AVAILABLE', 'VIP', 7),
(651, 'G', 3, 'AVAILABLE', 'VIP', 7),
(652, 'G', 5, 'AVAILABLE', 'VIP', 7),
(653, 'G', 6, 'AVAILABLE', 'VIP', 7),
(654, 'G', 7, 'AVAILABLE', 'VIP', 7),
(655, 'G', 8, 'AVAILABLE', 'VIP', 7),
(656, 'G', 10, 'AVAILABLE', 'VIP', 7),
(657, 'G', 9, 'AVAILABLE', 'VIP', 7),
(658, 'H', 1, 'AVAILABLE', 'VIP', 7),
(659, 'H', 2, 'AVAILABLE', 'VIP', 7),
(660, 'H', 3, 'AVAILABLE', 'VIP', 7),
(661, 'H', 4, 'AVAILABLE', 'VIP', 7),
(662, 'H', 5, 'AVAILABLE', 'VIP', 7),
(663, 'H', 6, 'AVAILABLE', 'VIP', 7),
(664, 'H', 7, 'AVAILABLE', 'VIP', 7),
(665, 'H', 8, 'AVAILABLE', 'VIP', 7),
(666, 'H', 10, 'AVAILABLE', 'VIP', 7),
(667, 'H', 9, 'AVAILABLE', 'VIP', 7),
(668, 'I', 1, 'AVAILABLE', 'VIP', 7),
(669, 'I', 2, 'AVAILABLE', 'VIP', 7),
(670, 'I', 3, 'AVAILABLE', 'VIP', 7),
(671, 'I', 5, 'AVAILABLE', 'VIP', 7),
(672, 'I', 4, 'AVAILABLE', 'VIP', 7),
(673, 'I', 6, 'AVAILABLE', 'VIP', 7),
(674, 'I', 7, 'AVAILABLE', 'VIP', 7),
(675, 'I', 8, 'AVAILABLE', 'VIP', 7),
(676, 'I', 9, 'AVAILABLE', 'VIP', 7),
(677, 'I', 10, 'AVAILABLE', 'VIP', 7),
(678, 'J', 1, 'AVAILABLE', 'COUPLE', 7),
(679, 'J', 2, 'AVAILABLE', 'COUPLE', 7),
(680, 'J', 3, 'AVAILABLE', 'COUPLE', 7),
(681, 'J', 4, 'AVAILABLE', 'COUPLE', 7),
(682, 'J', 5, 'AVAILABLE', 'COUPLE', 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `showtimes`
--

CREATE TABLE `showtimes` (
  `id` bigint(20) NOT NULL,
  `base_price` double NOT NULL,
  `end_time` time NOT NULL,
  `show_date` date NOT NULL,
  `start_time` time NOT NULL,
  `movie_id` bigint(20) NOT NULL,
  `room_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `showtimes`
--

INSERT INTO `showtimes` (`id`, `base_price`, `end_time`, `show_date`, `start_time`, `movie_id`, `room_id`) VALUES
(1, 85000, '19:30:00', '2026-07-13', '18:00:00', 1, 1),
(2, 120000, '21:00:00', '2026-07-14', '19:00:00', 2, 3),
(3, 150000, '23:00:00', '2026-07-15', '20:00:00', 3, 5),
(4, 75000, '11:00:00', '2026-07-13', '09:00:00', 4, 2),
(5, 90000, '12:30:00', '2026-07-14', '10:00:00', 1, 4),
(6, 85000, '11:45:00', '2026-07-13', '10:00:00', 1, 1),
(7, 85000, '15:30:00', '2026-07-13', '14:00:00', 1, 1),
(8, 85000, '13:45:00', '2026-07-13', '12:15:00', 1, 1),
(9, 120000, '18:30:00', '2026-07-14', '17:00:00', 2, 3),
(10, 120000, '14:35:00', '2026-07-14', '15:00:00', 2, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) NOT NULL,
  `price` double NOT NULL,
  `status` varchar(255) NOT NULL,
  `invoice_id` bigint(20) DEFAULT NULL,
  `seat_id` bigint(20) NOT NULL,
  `showtime_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tickets`
--

INSERT INTO `tickets` (`id`, `price`, `status`, `invoice_id`, `seat_id`, `showtime_id`) VALUES
(16, 85000, 'BOOKED', NULL, 33, 1),
(17, 85000, 'BOOKED', NULL, 32, 1),
(18, 85000, 'BOOKED', NULL, 31, 1),
(19, 85000, 'BOOKED', NULL, 30, 1),
(78, 110000, 'BOOKED', 57, 389, 5),
(79, 110000, 'BOOKED', 57, 390, 5),
(80, 125000, 'BOOKED', 58, 1, 1),
(81, 105000, 'BOOKED', 59, 2, 1),
(82, 105000, 'BOOKED', 60, 3, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `active`, `created_at`, `email`, `full_name`, `password`, `phone`, `role`) VALUES
(4, b'1', '2026-07-13 15:24:05.000000', 'nhanvien@gmail.com', 'Nhân Viên Rạp', '$2a$10$o0a1BkjQBew8YNEJMl.SReWhvbzv68s/hqezRmNNOvfa2Ll3h/IGa', '0987654323', 'STAFF'),
(6, b'1', '2026-07-13 08:26:01.000000', 'buiviet300304@gmail.com', 'viet bui', '$2a$10$mZ721wHORonujjbxPLG1juVIdwp2D1MT351hYDB8eDnmtSeoTlx1O', '08349545', 'ADMIN'),
(7, b'1', '2026-07-13 08:33:48.000000', 'buiviet30034@gmail.com', 'viet', '$2a$10$TH0cGmHzgtzXWhJ3oZX10.w0wamdfPNmgEoWp2S2jkLyEP4nFTiai', '0965472342', 'CUSTOMER'),
(18, b'1', '2026-07-14 05:47:39.000000', 'test_1784008059835_qxljubli1@test.com', 'Test User 1784008059835', '$2a$10$BKzeLC0Yd6qLuxpnh1zdjezqjL75pJse.mq8ZWy3mUPQ6aGRCjX46', '0919877594', 'CUSTOMER'),
(19, b'1', '2026-07-14 05:52:53.000000', 'test_1784008372865_q5ltz1few@test.com', 'Test User 1784008372865', '$2a$10$cagEAL8KH6LOV7OVkpsdFOVn1wcuz/nQf30LzVEOOnsuPsOpQaU/O', '0912551409', 'CUSTOMER'),
(20, b'1', '2026-07-14 05:54:34.000000', 'test_1784008474347_cuuahi5rg@test.com', 'Test User 1784008474347', '$2a$10$Pfn/KsDtfJu21o31JYMmguN9xs4OrN6RgaswnU0Mw9H/w66So6A1a', '0913831899', 'CUSTOMER'),
(21, b'1', '2026-07-14 05:54:50.000000', 'test_1784008490662_bxiw4rqr6@test.com', 'Test User 1784008490662', '$2a$10$V357mE0fnZyBKQa2RkRMfuEFO4BmgfoMSrx7rytR8u3uy3Rn/5o/y', '0910478058', 'CUSTOMER'),
(22, b'1', '2026-07-14 05:55:15.000000', 'test_1784008515775_nflr2gdnu@test.com', 'Test User 1784008515775', '$2a$10$pGEG.4yDazZ1j8ZGJhKtduGLikI85bAoFrEQuxlN5fMBuNxLjAm2O', '0918565156', 'CUSTOMER'),
(23, b'1', '2026-07-14 06:03:02.000000', 'test_1784008981945_r3gk0pvul@test.com', 'Test User 1784008981945', '$2a$10$iQkzyU/n3XMd/qrEss49UObj2Dr3h5T3d2hnA6qqxZv3h4eOcy4u2', '0917954075', 'CUSTOMER'),
(24, b'1', '2026-07-14 06:03:33.000000', 'test_v_1784009013033@test.com', 'Test Voucher User', '$2a$10$nLOiWDd6AeXZKoezyyTRfO2Ft6xsyN7roGirh9/Kecdux4AeaUWRq', '0927288972', 'CUSTOMER'),
(25, b'1', '2026-07-14 06:03:50.000000', 'test_v_1784009030860@test.com', 'Test Voucher User', '$2a$10$/hGIeXz/Zx2K9scaAeU/Wer4FUjDJYdvdvOz8BqfRciSa5AawRxWW', '0921009322', 'CUSTOMER'),
(26, b'1', '2026-07-14 06:04:46.000000', 'test_1784009085869_u1ds9cqei@test.com', 'Test User 1784009085869', '$2a$10$eaQK.wYtw106LjtORDWeROXvkQwH3G1sPAAZsOOhUoLQbZ1F3psVO', '0918532074', 'CUSTOMER'),
(27, b'1', '2026-07-14 06:05:17.000000', 'test_v_1784009116967@test.com', 'Test Voucher User', '$2a$10$7BP3BxcYa.kCzvxbdK7ivOuhBI5jqvXojiOkT3SJ.HTHP4HUOnvuC', '0928911718', 'CUSTOMER'),
(28, b'1', '2026-07-14 06:11:10.000000', 'test_1784009470331_fmpqw4ttg@test.com', 'Test User 1784009470331', '$2a$10$q0dug6eBKjyAowP/GSKsP.sWP20pnc/8gDWJ/gdNgDI6dhkHE.Loy', '0919401424', 'CUSTOMER');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_amount` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `active`, `code`, `discount_amount`) VALUES
(1, b'1', 'CGV20K', 20000),
(2, b'1', 'CGV50K', 50000),
(3, b'1', 'CGV100K', 100000);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cinemas`
--
ALTER TABLE `cinemas`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `foods_drinks`
--
ALTER TABLE `foods_drinks`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbwr4d4vyqf2bkoetxtt8j9dx7` (`user_id`);

--
-- Chỉ mục cho bảng `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrlfvhwtdf6u6hnsdt49irf1td` (`food_drink_id`),
  ADD KEY `FK439lfpbc6j1k0cn26wtp8f96r` (`invoice_id`);

--
-- Chỉ mục cho bảng `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjp9bjtvlojbw581bpq23cpw4j` (`cinema_id`);

--
-- Chỉ mục cho bảng `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKg993pi7ucgy616icmddq8u335` (`room_id`);

--
-- Chỉ mục cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKeltpyuei1d5g3n6ikpsjwwil6` (`movie_id`),
  ADD KEY `FKrumrrbei9jppryk4teoyoetit` (`room_id`);

--
-- Chỉ mục cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbruxuirw7xb9k4b6os07txvcj` (`invoice_id`),
  ADD KEY `FK1f6n3pv4b80wl6gj4ra32ctxk` (`seat_id`),
  ADD KEY `FKo0u22315eoxdv59tn6wsdn8b1` (`showtime_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK30ftp2biebbvpik8e49wlmady` (`code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `cinemas`
--
ALTER TABLE `cinemas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `foods_drinks`
--
ALTER TABLE `foods_drinks`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT cho bảng `invoice_details`
--
ALTER TABLE `invoice_details`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `movies`
--
ALTER TABLE `movies`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `seats`
--
ALTER TABLE `seats`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=683;

--
-- AUTO_INCREMENT cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `FKbwr4d4vyqf2bkoetxtt8j9dx7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `invoice_details`
--
ALTER TABLE `invoice_details`
  ADD CONSTRAINT `FK439lfpbc6j1k0cn26wtp8f96r` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  ADD CONSTRAINT `FKrlfvhwtdf6u6hnsdt49irf1td` FOREIGN KEY (`food_drink_id`) REFERENCES `foods_drinks` (`id`);

--
-- Các ràng buộc cho bảng `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `FKjp9bjtvlojbw581bpq23cpw4j` FOREIGN KEY (`cinema_id`) REFERENCES `cinemas` (`id`);

--
-- Các ràng buộc cho bảng `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `FKg993pi7ucgy616icmddq8u335` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Các ràng buộc cho bảng `showtimes`
--
ALTER TABLE `showtimes`
  ADD CONSTRAINT `FKeltpyuei1d5g3n6ikpsjwwil6` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `FKrumrrbei9jppryk4teoyoetit` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`);

--
-- Các ràng buộc cho bảng `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `FK1f6n3pv4b80wl6gj4ra32ctxk` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`),
  ADD CONSTRAINT `FKbruxuirw7xb9k4b6os07txvcj` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  ADD CONSTRAINT `FKo0u22315eoxdv59tn6wsdn8b1` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
