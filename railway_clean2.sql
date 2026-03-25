-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: autorack.proxy.rlwy.net:28109
-- Generation Time: Mar 23, 2026 at 08:49 AM
-- Server version: 9.4.0
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `railway`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_plans`
--

CREATE TABLE `access_plans` (
  `id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tier` varchar(50) DEFAULT NULL,
  `price` varchar(50) DEFAULT NULL,
  `period` varchar(50) DEFAULT NULL,
  `yearly_price` varchar(50) DEFAULT NULL,
  `description` text,
  `features` json DEFAULT NULL,
  `commitment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `access_plans`
--

INSERT INTO `access_plans` (`id`, `name`, `tier`, `price`, `period`, `yearly_price`, `description`, `features`, `commitment`, `created_at`, `updated_at`) VALUES
('plan-1774096556282', 'BASIC', 'BASIC1', '499', NULL, NULL, 'HELLO', '[\"HELLO\"]', 'Monthly or Yearly subscription.', '2026-03-21 12:35:56', '2026-03-21 12:35:56'),
('plan-1774097981925', 'gsdfsdfg', 'Gold', '499', '/ Month', NULL, 'sfdf', '[\"fgsdfgfg\"]', NULL, '2026-03-21 12:59:41', '2026-03-21 12:59:41');

-- --------------------------------------------------------

--
-- Table structure for table `audits`
--

CREATE TABLE `audits` (
  `id` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auditor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `accuracy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` int DEFAULT NULL,
  `changed_by` varchar(255) DEFAULT NULL,
  `old_values` text,
  `new_values` text,
  `module` varchar(100) DEFAULT NULL,
  `resource_id` int DEFAULT NULL,
  `old_value` text,
  `new_value` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `	tenants`
--

CREATE TABLE `	tenants` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `address` text,
  `location` varchar(100) DEFAULT NULL,
  `source` varchar(50) DEFAULT 'Manual',
  `client_type` enum('SaaS','Personal') DEFAULT 'Personal',
  `plan` varchar(50) DEFAULT 'Starter',
  `billing_cycle` varchar(50) DEFAULT 'Monthly',
  `payment_method` varchar(50) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `business_name` varchar(100) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `primary_color` varchar(20) DEFAULT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `	tenants`
--

INSERT INTO `	tenants` (`id`, `user_id`, `address`, `location`, `source`, `client_type`, `plan`, `billing_cycle`, `payment_method`, `contact_person`, `business_name`, `logo_url`, `primary_color`, `tagline`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 8, NULL, NULL, 'Manual', 'SaaS', 'Enterprise', 'Monthly', NULL, NULL, 'Institutional Partner 11', NULL, NULL, NULL, 'active', '2026-03-21 12:14:13', '2026-03-21 12:14:13', NULL),
(2, 9, 'xxvbcv', 'sdgdf', 'Manual', 'SaaS', 'Standard', 'Monthly', 'Wire Transfer', 'dgsdfgffd', 'bvbxcv', NULL, NULL, NULL, 'Active', '2026-03-21 12:22:35', '2026-03-21 12:22:35', NULL),
(3, 10, NULL, 'monaco', 'Landing Page', 'SaaS', 'BASIC', 'Monthly', 'Credit Card', 'smith', 'jhon', NULL, NULL, NULL, 'active', '2026-03-21 12:39:23', '2026-03-21 12:39:23', NULL),
(4, 13, 'Freeport, Bahamas', 'Freeport, Bahamas', 'Manual', 'SaaS', 'Standard', 'Monthly', 'Cash / Institutional', 'Paradise Luxe Hair', 'Paradise Luxe Hair', NULL, NULL, NULL, 'Active', '2026-03-21 14:43:22', '2026-03-21 14:43:22', NULL),
(5, 14, 'Nassau, Bahamas', 'Nassau, Bahamas', 'Manual', 'Personal', 'Standard', 'Monthly', 'Cash / Institutional', 'Ashley Brown', NULL, NULL, NULL, NULL, 'Active', '2026-03-21 14:52:06', '2026-03-21 14:52:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `vehicle_id` int DEFAULT NULL,
  `driver_id` int DEFAULT NULL,
  `route_id` int DEFAULT NULL,
  `mission_type` enum('Logistics','Chauffeur') COLLATE utf8mb4_unicode_ci DEFAULT 'Logistics',
  `passenger_info` json DEFAULT NULL,
  `package_details` json DEFAULT NULL,
  `pod` json DEFAULT NULL,
  `destination_type` enum('Domestic','International','Private Island','Deep Sea') COLLATE utf8mb4_unicode_ci DEFAULT 'Domestic',
  `customs_clearance` tinyint(1) DEFAULT '0',
  `client_confirmed` tinyint(1) DEFAULT '0',
  `client_confirmed_at` timestamp NULL DEFAULT NULL,
  `client_signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `route` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custom_route` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `proof_of_delivery_signature` text COLLATE utf8mb4_unicode_ci,
  `proof_of_delivery_photo` text COLLATE utf8mb4_unicode_ci,
  `delivery_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`id`, `project_id`, `order_id`, `vehicle_id`, `driver_id`, `route_id`, `mission_type`, `passenger_info`, `package_details`, `pod`, `destination_type`, `customs_clearance`, `client_confirmed`, `client_confirmed_at`, `client_signature`, `route`, `custom_route`, `status`, `proof_of_delivery_signature`, `proof_of_delivery_photo`, `delivery_date`, `created_at`, `updated_at`) VALUES
(2001, NULL, 1001, NULL, 5, NULL, 'Logistics', NULL, NULL, NULL, 'Domestic', 0, 0, NULL, NULL, NULL, NULL, 'en_route', NULL, NULL, NULL, '2026-03-21 12:14:18', '2026-03-21 12:14:18'),
(2002, NULL, 1002, NULL, 5, NULL, 'Logistics', NULL, NULL, NULL, 'Domestic', 0, 0, NULL, NULL, NULL, NULL, 'Delivered', NULL, NULL, NULL, '2026-03-21 12:14:18', '2026-03-21 12:14:18'),
(2003, NULL, NULL, NULL, NULL, NULL, 'Chauffeur', '\"{\\\"passengers\\\":\\\"1\\\",\\\"luggage\\\":\\\"Yes\\\",\\\"amenities\\\":[\\\"Baby Car Seat\\\"],\\\"serviceType\\\":\\\"One Way\\\"}\"', NULL, NULL, 'Domestic', 0, 0, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL, '2026-03-21 13:00:20', '2026-03-21 13:00:20'),
(2004, NULL, NULL, NULL, NULL, NULL, 'Chauffeur', '\"{\\\"passengers\\\":\\\"3\\\",\\\"luggage\\\":\\\"Yes\\\",\\\"amenities\\\":[\\\"WiFi\\\",\\\"Refreshments\\\"],\\\"serviceType\\\":\\\"Round Trip\\\"}\"', NULL, NULL, 'Domestic', 0, 0, NULL, NULL, NULL, NULL, 'Pending', NULL, NULL, NULL, '2026-03-21 15:28:48', '2026-03-21 15:28:48');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_items`
--

CREATE TABLE `delivery_items` (
  `id` int NOT NULL,
  `delivery_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` int DEFAULT '1',
  `weight` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_pricing`
--

CREATE TABLE `delivery_pricing` (
  `id` int NOT NULL,
  `min_distance` decimal(10,2) NOT NULL,
  `max_distance` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `delivery_pricing`
--

INSERT INTO `delivery_pricing` (`id`, `min_distance`, `max_distance`, `price`, `created_at`, `updated_at`) VALUES
(1, 0.00, 10.00, 25.00, '2026-03-21 12:14:19', '2026-03-21 12:14:19'),
(2, 10.00, 50.00, 75.00, '2026-03-21 12:14:19', '2026-03-21 12:14:19'),
(3, 50.00, 100.00, 150.00, '2026-03-21 12:14:19', '2026-03-21 12:14:19'),
(4, 100.00, 500.00, 450.00, '2026-03-21 12:14:19', '2026-03-21 12:14:19');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `location` text,
  `event_date` datetime DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `status` enum('planned','ongoing','completed','cancelled') DEFAULT 'planned',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `description`, `location`, `event_date`, `client_id`, `manager_id`, `status`, `created_at`) VALUES
(1, 'hgfgh', NULL, 'hfghdg', '2026-03-21 00:00:00', NULL, 2, 'planned', '2026-03-21 12:50:49'),
(3, 'Birthday', NULL, '', '2026-03-23 00:00:00', 4, 13, 'planned', '2026-03-21 14:56:56'),
(4, 'Sweet 16', NULL, '', '2026-03-27 00:00:00', 4, 13, 'planned', '2026-03-21 15:00:41');

-- --------------------------------------------------------

--
-- Table structure for table `guest_requests`
--

CREATE TABLE `guest_requests` (
  `id` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `guest` varchar(255) DEFAULT NULL,
  `requested_by` varchar(255) DEFAULT NULL,
  `request_details` text NOT NULL,
  `delivery_time` datetime DEFAULT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high','vip') DEFAULT 'medium',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(100) NOT NULL,
  `description` text,
  `category` varchar(100) DEFAULT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `threshold` int DEFAULT '10',
  `warehouse_id` int DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `inventory_type` enum('Marketplace','Client') DEFAULT 'Marketplace',
  `client_id` int DEFAULT NULL,
  `	tenant_id` int DEFAULT NULL,
  `status` enum('in_stock','out_of_stock','low_stock') DEFAULT 'in_stock',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `name`, `sku`, `description`, `category`, `unit`, `quantity`, `threshold`, `warehouse_id`, `vendor_id`, `price`, `inventory_type`, `client_id`, `	tenant_id`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Industrial Generator G-400', 'GEN-400', NULL, 'Power Systems', NULL, 5, 10, 1, 1, 12500.00, 'Marketplace', NULL, NULL, 'in_stock', '2026-03-21 12:14:15', '2026-03-21 12:14:15', NULL),
(2, 'Luxury SUV Spare (R22)', 'TIRE-LX22', NULL, 'Fleet Maintenance', NULL, 12, 10, 1, 2, 450.00, 'Marketplace', NULL, NULL, 'in_stock', '2026-03-21 12:14:15', '2026-03-21 12:14:15', NULL),
(3, 'Secured Communication Module', 'SEC-COM-01', NULL, 'IT & Comms', NULL, 25, 10, 2, 1, 890.00, 'Marketplace', NULL, NULL, 'in_stock', '2026-03-21 12:14:15', '2026-03-21 12:14:15', NULL),
(4, 'Snickers', 'SKU-7481', NULL, 'Stock Entry', NULL, 100, 10, 1, NULL, 1.50, 'Marketplace', NULL, NULL, 'in_stock', '2026-03-21 15:21:22', '2026-03-21 15:22:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `client_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('unpaid','partially_paid','paid','overdue','cancelled') DEFAULT 'unpaid',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `order_id`, `client_id`, `amount`, `due_date`, `status`, `created_at`, `updated_at`) VALUES
(3001, 1001, 1, 25000.00, NULL, 'unpaid', '2026-03-21 12:14:18', '2026-03-21 12:14:18'),
(3002, 1002, 1, 890.00, NULL, 'partially_paid', '2026-03-21 12:14:18', '2026-03-21 12:14:18');

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`id`, `user_id`, `type`, `start_date`, `end_date`, `reason`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'Personal Leave', '2026-03-21', '2026-03-22', '', 'pending', '2026-03-21 13:00:53', '2026-03-21 13:00:53');

-- --------------------------------------------------------

--
-- Table structure for table `luxury_items`
--

CREATE TABLE `luxury_items` (
  `id` int NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `vault_location` varchar(100) DEFAULT NULL,
  `estimated_value` varchar(50) DEFAULT NULL,
  `status` enum('Stored','In Transit','Released','Pending') DEFAULT 'Stored',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `luxury_items`
--

INSERT INTO `luxury_items` (`id`, `item_name`, `owner_name`, `vault_location`, `estimated_value`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'fgdfg', 'fgsdfg', 'Vault Alpha', 'fdsgdfg', 'Stored', NULL, '2026-03-21 12:59:13', '2026-03-21 12:59:13');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` varchar(255) NOT NULL,
  `icon` varchar(50) DEFAULT 'Circle',
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `path`, `icon`, `parent_id`, `sort_order`, `created_at`) VALUES
(1, 'Dashboard', '/dashboard', 'LayoutDashboard', NULL, 10, '2026-03-21 12:14:20'),
(2, 'Staff Management', '/dashboard/users', 'UserCog', NULL, 20, '2026-03-21 12:14:20'),
(3, 'Security Protocols', '/dashboard/roles-permissions', 'ShieldCheck', NULL, 30, '2026-03-21 12:14:20'),
(4, 'SaaS Management', '/dashboard/plans', 'Globe', NULL, 40, '2026-03-21 12:14:20'),
(5, '	tenants', '/dashboard/	tenants', 'Building', NULL, 50, '2026-03-21 12:14:20'),
(6, 'Projects', '/dashboard/projects', 'Briefcase', NULL, 60, '2026-03-21 12:14:20'),
(7, 'Deliveries', '/dashboard/deliveries', 'MapPin', NULL, 70, '2026-03-21 12:14:20'),
(8, 'Orders', '/dashboard/orders', 'ShoppingCart', NULL, 80, '2026-03-21 12:14:20'),
(9, 'Active Missions', '/dashboard/missions', 'Target', NULL, 90, '2026-03-21 12:14:20'),
(10, 'Fleet', '/dashboard/fleet', 'Truck', NULL, 100, '2026-03-21 12:14:20'),
(11, 'Urgent Dispatches', '/dashboard/logistics-urgent', 'AlertCircle', NULL, 110, '2026-03-21 12:14:20'),
(12, 'Purchase Requests', '/dashboard/purchase-requests', 'FileText', NULL, 120, '2026-03-21 12:14:20'),
(13, 'Purchase Orders', '/dashboard/purchase-orders', 'ShoppingBag', NULL, 130, '2026-03-21 12:14:20'),
(14, 'Vendors', '/dashboard/vendors', 'Truck', NULL, 140, '2026-03-21 12:14:20'),
(15, 'Inventory Hub', '/dashboard/inventory', 'Package', NULL, 210, '2026-03-21 12:14:20'),
(16, 'Warehouses', '/dashboard/warehouses', 'Building2', NULL, 160, '2026-03-21 12:14:20'),
(17, 'Stock Alerts', '/dashboard/inventory-alerts', 'AlertCircle', NULL, 170, '2026-03-21 12:14:20'),
(18, 'Guest Requests', '/dashboard/guest-requests', 'BellConcierge', NULL, 180, '2026-03-21 12:14:20'),
(19, 'Luxury Items', '/dashboard/luxury-items', 'Diamond', NULL, 190, '2026-03-21 12:14:20'),
(20, 'Event Access', '/dashboard/event-access', 'Ticket', NULL, 200, '2026-03-21 12:14:20'),
(21, 'Chauffeur Protocol', '/dashboard/chauffeur', 'Car', NULL, 280, '2026-03-21 12:14:20'),
(22, 'Staff Terminal', '/dashboard/staff-terminal', 'Smartphone', NULL, 220, '2026-03-21 12:14:20'),
(23, 'Reports', '/dashboard/reports', 'BarChart2', NULL, 230, '2026-03-21 12:14:20'),
(24, 'Payroll', '/dashboard/payroll', 'DollarSign', NULL, 240, '2026-03-21 12:14:20'),
(25, 'Invoices', '/dashboard/invoices', 'FileText', NULL, 250, '2026-03-21 12:14:20'),
(26, 'Settings', '/dashboard/settings', 'Settings', NULL, 260, '2026-03-21 12:14:20'),
(27, 'Support Dashboard', '/dashboard/support-tickets', 'Headphones', NULL, 270, '2026-03-21 12:14:20'),
(28, 'Leave & Absence', '/dashboard?tab=leave', 'Calendar', NULL, 280, '2026-03-21 12:14:20'),
(29, 'Pay & Records', '/dashboard?tab=pay', 'History', NULL, 290, '2026-03-21 12:14:20'),
(30, 'Audit Protocol', '/dashboard/audits', 'BarChart2', NULL, 310, '2026-03-21 12:14:20'),
(32, 'Quotes', '/dashboard/quotes', 'Box', NULL, 320, '2026-03-21 12:14:20'),
(33, 'Logistics Routes', '/dashboard/logistics-routes', 'Navigation', NULL, 330, '2026-03-21 12:14:20'),
(34, 'Tracking', '/dashboard/logistics-tracking', 'Activity', NULL, 340, '2026-03-21 12:14:20'),
(35, 'Events', '/dashboard/events', 'Calendar', NULL, 350, '2026-03-21 12:14:20'),
(36, 'Marketplace', '/dashboard/store?tab=catalog', 'ShoppingBag', NULL, 360, '2026-03-21 12:14:20'),
(37, 'Custom Requisition', '/dashboard/store?tab=sheet', 'FileText', NULL, 370, '2026-03-21 12:14:20'),
(38, 'My Orders (Client)', '/dashboard/client-orders', 'Package', NULL, 380, '2026-03-21 12:14:20'),
(40, 'Concierge Events (Client)', '/dashboard/client-events', 'Calendar', NULL, 400, '2026-03-21 12:14:20'),
(41, 'Track Delivery (Client)', '/dashboard/track-delivery', 'Truck', NULL, 410, '2026-03-21 12:14:20'),
(43, 'VIP Access Plans', '/dashboard/vip-access', 'ShieldCheck', NULL, 430, '2026-03-21 12:14:20');

-- --------------------------------------------------------

--
-- Table structure for table `missions`
--

CREATE TABLE `missions` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `mission_type` enum('Logistics','Chauffeur','Concierge') COLLATE utf8mb4_unicode_ci DEFAULT 'Logistics',
  `event_date` datetime DEFAULT NULL,
  `status` enum('pending','assigned','in_progress','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assigned_driver` int DEFAULT NULL,
  `vehicle_id` int DEFAULT NULL,
  `route_id` int DEFAULT NULL,
  `destination_type` enum('Domestic','International','Private Island','Deep Sea') COLLATE utf8mb4_unicode_ci DEFAULT 'Domestic',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `missions`
--

INSERT INTO `missions` (`id`, `order_id`, `project_id`, `mission_type`, `event_date`, `status`, `assigned_driver`, `vehicle_id`, `route_id`, `destination_type`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(5001, 1001, NULL, 'Logistics', NULL, 'in_progress', 5, NULL, NULL, 'Domestic', 'High-priority delivery for Industrial Generators', '2026-03-21 12:14:16', '2026-03-21 12:14:16', NULL),
(5002, 1002, NULL, 'Logistics', NULL, 'completed', 5, NULL, NULL, 'Domestic', 'Routine IT comms delivery', '2026-03-21 12:14:16', '2026-03-21 12:14:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mission_items`
--

CREATE TABLE `mission_items` (
  `id` int NOT NULL,
  `mission_id` int NOT NULL,
  `item_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` int DEFAULT '1',
  `weight` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `length` decimal(10,2) DEFAULT NULL,
  `width` decimal(10,2) DEFAULT NULL,
  `height` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mission_items`
--

INSERT INTO `mission_items` (`id`, `mission_id`, `item_name`, `qty`, `weight`, `length`, `width`, `height`, `created_at`) VALUES
(1, 5001, 'Industrial Generator G-400', 2, '2500kg', NULL, NULL, NULL, '2026-03-21 12:14:17'),
(2, 5002, 'Secured Communication Module', 1, '5kg', NULL, NULL, NULL, '2026-03-21 12:14:17');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `client_id` int NOT NULL,
  `	tenant_id` int DEFAULT NULL,
  `vendor_id` int DEFAULT NULL,
  `type` varchar(100) DEFAULT 'Custom Order',
  `status` enum('pending_review','approved','project_converted','in_progress','completed','cancelled') DEFAULT 'pending_review',
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` timestamp NULL DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `client_id`, `	tenant_id`, `vendor_id`, `type`, `status`, `total_amount`, `order_date`, `due_date`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1001, 8, 1, NULL, 'Custom Order', 'approved', 25000.00, '2026-03-21 12:14:15', NULL, 'Priority site setup request.', '2026-03-21 12:14:15', '2026-03-21 12:14:15', NULL),
(1002, 8, 1, NULL, 'Custom Order', 'pending_review', 890.00, '2026-03-21 12:14:15', NULL, 'Routine equipment replacement.', '2026-03-21 12:14:15', '2026-03-21 12:14:15', NULL),
(1003, 14, 5, 1, 'Provisioning', 'pending_review', 38.61, '2026-03-21 00:00:00', '2026-03-25 00:00:00', NULL, '2026-03-21 15:13:37', '2026-03-21 15:14:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `item_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `item_id`, `name`, `quantity`, `unit_price`, `total_price`) VALUES
(1, 1001, 1, 'Industrial Generator G-400', 2, 12500.00, 25000.00),
(2, 1002, 3, 'Secured Communication Module', 1, 890.00, 890.00),
(5, 1003, NULL, 'Cherries', 39, 0.99, 38.61);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `base_salary` decimal(15,2) DEFAULT '0.00',
  `bonus` decimal(15,2) DEFAULT '0.00',
  `nib_deduction` decimal(15,2) DEFAULT '0.00',
  `medical_deduction` decimal(15,2) DEFAULT '0.00',
  `pension_deduction` decimal(15,2) DEFAULT '0.00',
  `savings_deduction` decimal(15,2) DEFAULT '0.00',
  `birthday_club` decimal(15,2) DEFAULT '0.00',
  `net_amount` decimal(15,2) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `method` varchar(50) DEFAULT 'Direct Deposit',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'manage_users', 'Create and edit users', '2026-03-21 12:14:20'),
(2, 'manage_roles', 'Manage roles and permissions', '2026-03-21 12:14:20'),
(3, 'view_procurement', 'View quotes and POs', '2026-03-21 12:14:20'),
(4, 'edit_procurement', 'Create and edit POs', '2026-03-21 12:14:20'),
(5, 'manage_inventory', 'Manage warehouse items', '2026-03-21 12:14:20'),
(6, 'manage_logistics', 'Dispatch missions', '2026-03-21 12:14:20'),
(7, 'view_finance', 'View reports and invoices', '2026-03-21 12:14:20'),
(8, 'manage_finance', 'Process payroll and settle invoices', '2026-03-21 12:14:20');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `	tenant_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `manager_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('planned','in_progress','on_hold','completed') DEFAULT 'planned',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `proof_of_delivery`
--

CREATE TABLE `proof_of_delivery` (
  `id` int NOT NULL,
  `mission_id` int NOT NULL,
  `photo` text COLLATE utf8mb4_unicode_ci,
  `signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gps_coordinates` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_orders`
--

CREATE TABLE `purchase_orders` (
  `id` int NOT NULL,
  `vendor_id` int NOT NULL,
  `	tenant_id` int DEFAULT NULL,
  `vendor_name` varchar(255) DEFAULT NULL,
  `total` decimal(15,2) DEFAULT '0.00',
  `status` enum('Pending','Authorized','Partially Received','Completed') DEFAULT 'Pending',
  `approval_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `approved_by_id` int DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_items`
--

CREATE TABLE `purchase_order_items` (
  `id` int NOT NULL,
  `po_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `ordered_qty` int NOT NULL,
  `received_qty` int DEFAULT '0',
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_requests`
--

CREATE TABLE `purchase_requests` (
  `id` int NOT NULL,
  `item_id` int DEFAULT NULL,
  `requested_qty` int DEFAULT NULL,
  `requester_id` int DEFAULT NULL,
  `requester` varchar(255) DEFAULT NULL,
  `items` text,
  `priority` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `	tenant_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending',
  `approval_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `approved_by_id` int DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id` int NOT NULL,
  `request_id` int DEFAULT NULL,
  `vendor_id` int NOT NULL,
  `items` text,
  `total` decimal(10,2) DEFAULT NULL,
  `lead_time` varchar(100) DEFAULT NULL,
  `validity` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `status` varchar(50) DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'super_admin', 'Full system access', '2026-03-21 12:14:19'),
(2, 'procurement', 'Procurement & Vendor access', '2026-03-21 12:14:19'),
(3, 'operations', 'Operations & Mission access', '2026-03-21 12:14:19'),
(4, 'logistics', 'Fleet & Logistics access', '2026-03-21 12:14:19'),
(5, 'inventory', 'Stock & Warehouse access', '2026-03-21 12:14:19'),
(6, 'concierge', 'VIP & Guest request access', '2026-03-21 12:14:19'),
(7, 'client', 'SaaS Client access', '2026-03-21 12:14:19'),
(8, 'staff', 'Field Staff access', '2026-03-21 12:14:19');

-- --------------------------------------------------------

--
-- Table structure for table `role_menu_permissions`
--

CREATE TABLE `role_menu_permissions` (
  `id` int NOT NULL,
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `can_view` tinyint(1) DEFAULT '0',
  `can_add` tinyint(1) DEFAULT '0',
  `can_edit` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_menu_permissions`
--

INSERT INTO `role_menu_permissions` (`id`, `role_id`, `menu_id`, `can_view`, `can_add`, `can_edit`, `can_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(2, 1, 2, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(3, 1, 3, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(4, 1, 4, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(5, 1, 5, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(6, 1, 6, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(7, 1, 7, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(8, 1, 8, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(9, 1, 9, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(10, 1, 10, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(11, 1, 11, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(12, 1, 12, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(13, 1, 13, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(14, 1, 14, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(15, 1, 15, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(16, 1, 16, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(17, 1, 17, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(18, 1, 18, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(19, 1, 19, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(20, 1, 20, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(21, 1, 21, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(22, 1, 22, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(23, 1, 23, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(24, 1, 24, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(25, 1, 25, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(26, 1, 26, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(27, 1, 27, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(28, 1, 28, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(29, 1, 29, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(30, 1, 30, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(31, 1, 32, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(32, 1, 33, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(33, 1, 34, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(34, 1, 35, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(35, 1, 36, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(36, 1, 37, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(37, 1, 38, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(38, 1, 40, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(39, 1, 41, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21'),
(40, 1, 43, 1, 1, 1, 1, '2026-03-21 12:14:21', '2026-03-21 12:14:21');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_location` text,
  `end_location` text,
  `distance_km` decimal(10,2) DEFAULT NULL,
  `estimated_time` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `clock_in` timestamp NULL DEFAULT NULL,
  `clock_out` timestamp NULL DEFAULT NULL,
  `duration_hours` decimal(5,2) DEFAULT '0.00',
  `status` enum('Active','Completed') DEFAULT 'Active',
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_assignments`
--

CREATE TABLE `staff_assignments` (
  `id` int NOT NULL,
  `assignee_id` int DEFAULT NULL,
  `task_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `due_date` date DEFAULT NULL,
  `priority` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Medium',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_details`
--

CREATE TABLE `staff_details` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `employment_status` enum('Full-time','Contract','Part-time','Probation','Full Time','Part Time') DEFAULT 'Full Time',
  `is_salaried` tinyint(1) DEFAULT '1',
  `vacation_balance` int DEFAULT '0',
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `routing_number` varchar(50) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `nib_number` varchar(50) DEFAULT NULL,
  `passport_url` varchar(500) DEFAULT NULL,
  `license_url` varchar(500) DEFAULT NULL,
  `nib_document_url` varchar(500) DEFAULT NULL,
  `police_record_url` varchar(500) DEFAULT NULL,
  `profile_pic_url` varchar(500) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `has_passport` tinyint(1) DEFAULT '0',
  `has_license` tinyint(1) DEFAULT '0',
  `has_nib_doc` tinyint(1) DEFAULT '0',
  `has_police_record` tinyint(1) DEFAULT '0',
  `has_resume` tinyint(1) DEFAULT '0',
  `has_profile_pic` tinyint(1) DEFAULT '0',
  `has_certs` tinyint(1) DEFAULT '0',
  `is_available` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `staff_details`
--

INSERT INTO `staff_details` (`id`, `user_id`, `employment_status`, `is_salaried`, `vacation_balance`, `bank_name`, `account_number`, `routing_number`, `payment_method`, `nib_number`, `passport_url`, `license_url`, `nib_document_url`, `police_record_url`, `profile_pic_url`, `birthday`, `has_passport`, `has_license`, `has_nib_doc`, `has_police_record`, `has_resume`, `has_profile_pic`, `has_certs`, `is_available`) VALUES
(1, 1, 'Full Time', 1, 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1),
(2, 2, 'Full Time', 1, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1),
(3, 3, 'Full Time', 1, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1),
(4, 4, 'Full Time', 1, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1),
(5, 5, 'Part Time', 1, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1),
(6, 6, 'Full Time', 1, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1),
(7, 7, 'Full Time', 1, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `type` enum('in','out','adjustment') NOT NULL,
  `reference_type` enum('order','purchase','adjustment','delivery') NOT NULL,
  `reference_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_requests`
--

CREATE TABLE `subscription_requests` (
  `id` int NOT NULL,
  `client_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requirements` text COLLATE utf8mb4_unicode_ci,
  `property_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `throughput` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'Pending',
  `request_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `priority` enum('low','normal','high','urgent') DEFAULT 'normal',
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `	tenant_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','operations','procurement','inventory','logistics','finance','sales','support','Field Staff','Operational Staff','Concierge Manager','Logistics Lead','Inventory Manager','Client','Vendor') DEFAULT 'operations',
  `status` varchar(50) DEFAULT 'Active',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `	tenant_id`, `name`, `email`, `phone`, `password`, `role`, `status`, `avatar_url`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'Super Admin', 'admin@zanezion.com', '1234567890', '$2b$10$4yK1qPmTtl8ouQv0cEh2vuXN2xfKWWPpQr.j5D1K7UJppWl4iuwPq', 'super_admin', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:20:45', NULL),
(2, NULL, 'Concierge Manager', 'demo1@example.com', '242-555-0101', '$2b$10$0upE9jQOGx/y8J/vyx8fsucmqzlC65AQ7cnBwo6.pgiVGsToxO55m', 'Concierge Manager', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:43:03', NULL),
(3, NULL, 'Operations Lead', 'operation@example.com', '242-555-0102', '$2b$10$1UZmcSrKFEbXsuTxFnt3Q.0eLrSThzWFJXN2jX3kxxFwAdjbU1j9m', 'operations', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:41:41', NULL),
(4, NULL, 'Logistics Lead', 'logistics@example.com', '242-555-0103', '$2b$10$nTfkTbhD7fXqWdyLZ/3gKeCFXfYlfWpCF0rKDHM6M0QFxrIyrwAmq', 'Logistics Lead', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:42:10', NULL),
(5, NULL, 'Field Staff Alpha', 'staff@example.com', '242-555-0104', '$2b$10$u2nQYwE2i..t61gYqI4jeOkztlsSeAdOMNGzNAB1WNQc4ZgHYJWXO', 'Field Staff', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:44:00', NULL),
(6, NULL, 'Procurement Officer', 'procurement@example.com', '242-555-0105', '$2b$10$c3r7m7du5m5Q39RApyVl/u39zD468uWBev6VX4anHrR4bLhSDK9d6', 'procurement', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:41:11', NULL),
(7, NULL, 'Inventory Manager', 'inventory@example.com', '242-555-0106', '$2b$10$zBwHisLb5/v4xYRb6tj7Q.RLh4pGg2TWLLz1xgJGWqiDbZap68fiC', 'Inventory Manager', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:42:37', NULL),
(8, NULL, 'Enterprise Client', 'client11@example.com', '242-555-0107', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'Client', 'Active', NULL, '2026-03-21 12:14:12', '2026-03-21 12:14:12', NULL),
(9, NULL, 'fgdfg', 'fdgsdfg@example.com', '0987654321', '$2b$10$nny863c5aEfJOMZANBY8Qe/GddxcO9lOo2U26gTucfAOyWkaDTXsy', 'Client', 'Active', NULL, '2026-03-21 12:22:35', '2026-03-21 12:22:35', NULL),
(10, NULL, 'jhon', 'jhon@example.com', NULL, '$2b$10$QL38DndZzzHShKNZPiRfL.vG9SMkKq57GHQ7/DLMxsFMorQ/.FbSy', 'Client', 'Active', NULL, '2026-03-21 12:39:23', '2026-03-21 12:39:23', NULL),
(11, NULL, 'client', 'john@client.com', '0123456789', '$2b$10$Bls8GuGqIG43oZ14myK3h.SQRyN6XBiA0xye6OjXm1AO7F7S2ZAvW', 'Client', 'Active', NULL, '2026-03-21 12:45:10', '2026-03-21 12:45:10', NULL),
(13, NULL, 'Paradise Luxe Hair', 'paradiseluxehairandcosmetics@gmail.com', '12423456789', '$2b$10$smT405U/rRyJkuVX48EwUOHI2uIthEt.r2Y7TO7XNm2JIaZ52NkC6', 'Client', 'Active', NULL, '2026-03-21 14:43:22', '2026-03-21 14:43:22', NULL),
(14, NULL, 'Ashley Brown', 'nails-hearsay-0r@icloud.com', '12423247865', '$2b$10$WEUw38mrJ0szzjM66KfkouTQp7HJWtVaEf7YmSgnsl/ClBG9wxvsG', 'Client', 'Active', NULL, '2026-03-21 14:52:06', '2026-03-21 14:52:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int NOT NULL,
  `plate_number` varchar(20) NOT NULL,
  `model` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `	tenant_id` int DEFAULT NULL,
  `fuel_level` int DEFAULT '100',
  `vehicle_type` enum('Van','Boat','Truck','Car','Plane') DEFAULT 'Truck',
  `status` varchar(50) DEFAULT 'available',
  `capacity` varchar(50) DEFAULT NULL,
  `insurance_policy` varchar(100) DEFAULT NULL,
  `registration_expiry` date DEFAULT NULL,
  `inspection_date` date DEFAULT NULL,
  `diagnostic_status` varchar(100) DEFAULT 'Healthy',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `	tenant_id` int DEFAULT NULL,
  `address` text,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendors`
--

INSERT INTO `vendors` (`id`, `user_id`, `name`, `contact_name`, `email`, `phone`, `	tenant_id`, `address`, `category`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, NULL, 'Global Logistics Corp', 'John Carter', 'contact@globallogistics.com', NULL, NULL, NULL, 'Shipping', 'active', '2026-03-21 12:14:13', '2026-03-21 12:14:13', NULL),
(2, NULL, 'Elite Fleet Services', 'Sarah Miller', 'admin@elitefleet.com', NULL, NULL, NULL, 'Chauffeur', 'active', '2026-03-21 12:14:13', '2026-03-21 12:14:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` text,
  `manager_id` int DEFAULT NULL,
  `	tenant_id` int DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`id`, `name`, `location`, `manager_id`, `	tenant_id`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Main Terminal A', 'Nassau Corporate District', NULL, NULL, 'active', '2026-03-21 12:14:14', '2026-03-21 12:14:14', NULL),
(2, 'Logistics Hub B', 'Freeport Coastal Zone', NULL, NULL, 'active', '2026-03-21 12:14:14', '2026-03-21 12:14:14', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_plans`
--
ALTER TABLE `access_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audits`
--
ALTER TABLE `audits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `	tenants`
--
ALTER TABLE `	tenants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `driver_id` (`driver_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `delivery_items`
--
ALTER TABLE `delivery_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `delivery_id` (`delivery_id`);

--
-- Indexes for table `delivery_pricing`
--
ALTER TABLE `delivery_pricing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `guest_requests`
--
ALTER TABLE `guest_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `vendor_id` (`vendor_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `	tenant_id` (`	tenant_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `luxury_items`
--
ALTER TABLE `luxury_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indexes for table `missions`
--
ALTER TABLE `missions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_driver` (`assigned_driver`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `route_id` (`route_id`);

--
-- Indexes for table `mission_items`
--
ALTER TABLE `mission_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mission_id` (`mission_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `	tenant_id` (`	tenant_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `manager_id` (`manager_id`),
  ADD KEY `	tenant_id` (`	tenant_id`);

--
-- Indexes for table `proof_of_delivery`
--
ALTER TABLE `proof_of_delivery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mission_id` (`mission_id`);

--
-- Indexes for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor_id` (`vendor_id`),
  ADD KEY `	tenant_id` (`	tenant_id`),
  ADD KEY `approved_by_id` (`approved_by_id`);

--
-- Indexes for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `po_id` (`po_id`);

--
-- Indexes for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `requester_id` (`requester_id`),
  ADD KEY `	tenant_id` (`	tenant_id`),
  ADD KEY `approved_by_id` (`approved_by_id`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role_menu_permissions`
--
ALTER TABLE `role_menu_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_menu` (`role_id`,`menu_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `staff_assignments`
--
ALTER TABLE `staff_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignee_id` (`assignee_id`);

--
-- Indexes for table `staff_details`
--
ALTER TABLE `staff_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `subscription_requests`
--
ALTER TABLE `subscription_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD KEY `	tenant_id` (`	tenant_id`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `	tenant_id` (`	tenant_id`);

--
-- Indexes for table `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manager_id` (`manager_id`),
  ADD KEY `	tenant_id` (`	tenant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audits`
--
ALTER TABLE `audits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `	tenants`
--
ALTER TABLE `	tenants`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2005;

--
-- AUTO_INCREMENT for table `delivery_items`
--
ALTER TABLE `delivery_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_pricing`
--
ALTER TABLE `delivery_pricing`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `guest_requests`
--
ALTER TABLE `guest_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3003;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `luxury_items`
--
ALTER TABLE `luxury_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `missions`
--
ALTER TABLE `missions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5003;

--
-- AUTO_INCREMENT for table `mission_items`
--
ALTER TABLE `mission_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1004;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `proof_of_delivery`
--
ALTER TABLE `proof_of_delivery`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `role_menu_permissions`
--
ALTER TABLE `role_menu_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `routes`
--
ALTER TABLE `routes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shifts`
--
ALTER TABLE `shifts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_assignments`
--
ALTER TABLE `staff_assignments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_details`
--
ALTER TABLE `staff_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_requests`
--
ALTER TABLE `subscription_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `	tenants`
--
ALTER TABLE `	tenants`
  ADD CONSTRAINT `	tenants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `deliveries_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `deliveries_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  ADD CONSTRAINT `deliveries_ibfk_4` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `deliveries_ibfk_5` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

--
-- Constraints for table `delivery_items`
--
ALTER TABLE `delivery_items`
  ADD CONSTRAINT `delivery_items_ibfk_1` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `	tenants` (`id`),
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `guest_requests`
--
ALTER TABLE `guest_requests`
  ADD CONSTRAINT `guest_requests_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD CONSTRAINT `inventory_items_ibfk_1` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `inventory_items_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `inventory_items_ibfk_3` FOREIGN KEY (`client_id`) REFERENCES `	tenants` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `inventory_items_ibfk_4` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `	tenants` (`id`);

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `missions`
--
ALTER TABLE `missions`
  ADD CONSTRAINT `missions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `missions_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `missions_ibfk_3` FOREIGN KEY (`assigned_driver`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `missions_ibfk_4` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  ADD CONSTRAINT `missions_ibfk_5` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

--
-- Constraints for table `mission_items`
--
ALTER TABLE `mission_items`
  ADD CONSTRAINT `mission_items_ibfk_1` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `inventory_items` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`);

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `proof_of_delivery`
--
ALTER TABLE `proof_of_delivery`
  ADD CONSTRAINT `proof_of_delivery_ibfk_1` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_orders`
--
ALTER TABLE `purchase_orders`
  ADD CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`),
  ADD CONSTRAINT `purchase_orders_ibfk_2` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_orders_ibfk_3` FOREIGN KEY (`approved_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_order_items`
--
ALTER TABLE `purchase_order_items`
  ADD CONSTRAINT `purchase_order_items_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `purchase_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchase_requests`
--
ALTER TABLE `purchase_requests`
  ADD CONSTRAINT `purchase_requests_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `inventory_items` (`id`),
  ADD CONSTRAINT `purchase_requests_ibfk_2` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `purchase_requests_ibfk_3` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchase_requests_ibfk_4` FOREIGN KEY (`approved_by_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `quotes`
--
ALTER TABLE `quotes`
  ADD CONSTRAINT `quotes_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `purchase_requests` (`id`),
  ADD CONSTRAINT `quotes_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`);

--
-- Constraints for table `role_menu_permissions`
--
ALTER TABLE `role_menu_permissions`
  ADD CONSTRAINT `role_menu_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_menu_permissions_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `shifts`
--
ALTER TABLE `shifts`
  ADD CONSTRAINT `shifts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `staff_assignments`
--
ALTER TABLE `staff_assignments`
  ADD CONSTRAINT `staff_assignments_ibfk_1` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `staff_details`
--
ALTER TABLE `staff_details`
  ADD CONSTRAINT `staff_details_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `inventory_items` (`id`),
  ADD CONSTRAINT `stock_movements_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vendors`
--
ALTER TABLE `vendors`
  ADD CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vendors_ibfk_2` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `warehouses`
--
ALTER TABLE `warehouses`
  ADD CONSTRAINT `warehouses_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `warehouses_ibfk_2` FOREIGN KEY (`	tenant_id`) REFERENCES `	tenants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
ALTER TABLE `warehouses`
  ADD CONSTRAINT `warehouses_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `warehouses_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


