-- ============================================================
-- HIR International CRM - Complete Database Setup Script
-- Run this script on your MySQL server to create the database
-- and all tables from scratch.
--
-- Usage:
--   mysql -u root -p < create_database.sql
-- ============================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `hir_international`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `hir_international`;

-- ============================================================
-- 2. Disable FK checks so tables can be created in any order
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 3. Drop all tables (in case of re-run)
-- ============================================================
DROP TABLE IF EXISTS `visa_travellers`;
DROP TABLE IF EXISTS `visas`;
DROP TABLE IF EXISTS `air_tickets`;
DROP TABLE IF EXISTS `quotations`;
DROP TABLE IF EXISTS `tour_enquiries`;
DROP TABLE IF EXISTS `passports`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `incentive`;
DROP TABLE IF EXISTS `incentive_settings`;
DROP TABLE IF EXISTS `leads`;
DROP TABLE IF EXISTS `lead_sources`;
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `campaigns`;
DROP TABLE IF EXISTS `vendors`;
DROP TABLE IF EXISTS `site_scenes`;
DROP TABLE IF EXISTS `packages`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `site_sections`;
DROP TABLE IF EXISTS `social_links`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `admins`;

-- ============================================================
-- 4. Create Tables (independent tables first, then dependent)
-- ============================================================

-- -----------------------------------------------
-- Table: admins
-- -----------------------------------------------
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: departments
-- -----------------------------------------------
CREATE TABLE `departments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: employees  (depends on: departments)
-- -----------------------------------------------
CREATE TABLE `employees` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `isMaster` tinyint(1) NOT NULL DEFAULT 0,
  `hasPackageAccess` tinyint(1) DEFAULT 0,
  `hasVisaAccess` tinyint(1) DEFAULT 0,
  `hasPassportAccess` tinyint(1) DEFAULT 0,
  `hasAirTicketAccess` tinyint(1) DEFAULT 0,
  `isVendorMaster` tinyint(1) DEFAULT 0,
  `isSiteSceneMaster` tinyint(1) DEFAULT 0,
  `hasEmployeeAccess` tinyint(1) DEFAULT 0,
  `hasDepartmentAccess` tinyint(1) DEFAULT 0,
  `hasCampaignAccess` tinyint(1) DEFAULT 0,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `departmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `joiningDate` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT 'active',
  `remarks` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `departmentId` (`departmentId`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: lead_sources
-- -----------------------------------------------
CREATE TABLE `lead_sources` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: leads  (depends on: lead_sources, employees)
-- -----------------------------------------------
CREATE TABLE `leads` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `source` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL,
  `assignedTo` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `leadType` varchar(255) DEFAULT NULL,
  `referenceBy` varchar(255) DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `source` (`source`),
  KEY `assignedTo` (`assignedTo`),
  KEY `userId` (`userId`),
  CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`source`) REFERENCES `lead_sources` (`id`),
  CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`assignedTo`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: campaigns
-- -----------------------------------------------
CREATE TABLE `campaigns` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `dateFrom` date NOT NULL,
  `dateTo` date NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: air_tickets  (depends on: employees, leads)
-- -----------------------------------------------
CREATE TABLE `air_tickets` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `paxName` varchar(255) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `dateOfTravel` datetime DEFAULT NULL,
  `tourDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tourDetails`)),
  `dateOfBooking` datetime DEFAULT NULL,
  `billTo` varchar(255) DEFAULT NULL,
  `purchase` decimal(10,2) DEFAULT NULL,
  `refundOfPurchase` decimal(10,2) DEFAULT 0.00,
  `sales` decimal(10,2) DEFAULT NULL,
  `refundOfSales` decimal(10,2) DEFAULT 0.00,
  `markup` decimal(10,2) DEFAULT NULL,
  `person` varchar(255) DEFAULT NULL,
  `totalSc` varchar(255) DEFAULT NULL,
  `pnr` varchar(255) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `paymentStatus` enum('paid','received','pending','refunded','refund_in_process') DEFAULT 'pending',
  `totalAmount` decimal(10,2) DEFAULT NULL,
  `type` varchar(255) DEFAULT 'Booking',
  `remarks` text DEFAULT NULL,
  `paymentTimeLine` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`paymentTimeLine`)),
  `reason` text DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `leadId` (`leadId`),
  CONSTRAINT `air_tickets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `air_tickets_ibfk_2` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: incentive  (depends on: employees)
-- -----------------------------------------------
CREATE TABLE `incentive` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(255) NOT NULL,
  `monthYear` datetime NOT NULL,
  `incentiveAmount` float NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `paidDate` date DEFAULT NULL,
  `paymentMode` varchar(255) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employeeId` (`employeeId`),
  CONSTRAINT `incentive_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: incentive_settings
-- -----------------------------------------------
CREATE TABLE `incentive_settings` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `monthYear` datetime NOT NULL,
  `airTicketBaseAmount` decimal(10,2) NOT NULL,
  `airTicketIncentivePercentage` decimal(5,2) NOT NULL,
  `visaIncentivePerFileAmount` decimal(10,2) NOT NULL,
  `minimumFileCount` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: notifications
-- -----------------------------------------------
CREATE TABLE `notifications` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `passportId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `markAsRead` tinyint(1) DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: packages
-- -----------------------------------------------
CREATE TABLE `packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `destination` varchar(200) NOT NULL,
  `category` enum('domestic','international') NOT NULL,
  `duration` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `pdf_url` varchar(500) DEFAULT NULL,
  `flag` varchar(50) DEFAULT 'location',
  `price_amount` decimal(10,2) DEFAULT NULL,
  `price_currency` varchar(10) DEFAULT 'INR',
  `display_price` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_category_active` (`category`,`is_active`),
  KEY `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: passports  (depends on: leads, employees)
-- -----------------------------------------------
CREATE TABLE `passports` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `passport_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `passportCategory` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `issueDate` datetime DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `renewProcess` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`renewProcess`)),
  `referenceBy` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `leadStatus` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `assignedTo` varchar(255) DEFAULT NULL,
  `processDate` datetime DEFAULT NULL,
  `processStatus` varchar(255) DEFAULT NULL,
  `processRemark` text DEFAULT NULL,
  `portalId` varchar(255) DEFAULT NULL,
  `portalPassword` varchar(255) DEFAULT NULL,
  `portalLink` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `userId` (`userId`),
  CONSTRAINT `passports_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `passports_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: tour_enquiries  (depends on: leads, employees)
-- -----------------------------------------------
CREATE TABLE `tour_enquiries` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `EnquiryNo` varchar(255) DEFAULT NULL,
  `isHotelOnly` tinyint(1) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `tourType` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contactNumber` varchar(255) DEFAULT NULL,
  `referenceBy` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pickupDate` datetime DEFAULT NULL,
  `dropDate` datetime DEFAULT NULL,
  `noOfNights` int(11) DEFAULT NULL,
  `pickupLocation` varchar(255) DEFAULT NULL,
  `dropLocation` varchar(255) DEFAULT NULL,
  `hotelDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hotelDetails`)),
  `noOfRooms` int(11) DEFAULT NULL,
  `noOfAdults` int(11) DEFAULT NULL,
  `noOfChildsBelow5` int(11) DEFAULT NULL,
  `noOfChildsWithExtraBed` int(11) DEFAULT NULL,
  `noOfChildsWithoutExtraBed` int(11) DEFAULT NULL,
  `vehicleChoice` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `inclusions` text DEFAULT NULL,
  `siteScenes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`siteScenes`)),
  `vendors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vendors`)),
  `rejectReason` text DEFAULT NULL,
  `revisionNotes` text DEFAULT NULL,
  `approvalComments` text DEFAULT NULL,
  `mealPlan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `EnquiryNo_unique` (`EnquiryNo`),
  KEY `leadId` (`leadId`),
  KEY `userId` (`userId`),
  CONSTRAINT `tour_enquiries_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tour_enquiries_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: quotations  (depends on: tour_enquiries, leads, employees)
-- -----------------------------------------------
CREATE TABLE `quotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `EnquiryNo` varchar(255) DEFAULT NULL,
  `quotationNo` varchar(255) DEFAULT NULL,
  `internalRemark` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'draft',
  `inclusions` text DEFAULT NULL,
  `exclusions` text DEFAULT NULL,
  `itinerary` text DEFAULT NULL,
  `visaExclusions` text DEFAULT NULL,
  `flightDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`flightDetails`)),
  `mealPlan` varchar(255) DEFAULT NULL,
  `accommodationDetails` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`accommodationDetails`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `EnquiryNo` (`EnquiryNo`),
  KEY `leadId` (`leadId`),
  KEY `userId` (`userId`),
  CONSTRAINT `quotations_ibfk_1` FOREIGN KEY (`EnquiryNo`) REFERENCES `tour_enquiries` (`EnquiryNo`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quotations_ibfk_2` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `quotations_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: settings
-- -----------------------------------------------
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(200) DEFAULT 'HIR International',
  `company_tagline` varchar(200) DEFAULT 'Crafting Extraordinary Journeys',
  `company_caption` varchar(500) DEFAULT 'Domestic & International Travel Solutions',
  `company_description` text DEFAULT NULL,
  `company_phone` varchar(20) DEFAULT NULL,
  `company_whatsapp` varchar(20) DEFAULT NULL,
  `company_email` varchar(100) DEFAULT NULL,
  `company_logo` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: site_scenes
-- -----------------------------------------------
CREATE TABLE `site_scenes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `siteType` varchar(255) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `sceneName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sceneName`)),
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: site_sections
-- -----------------------------------------------
CREATE TABLE `site_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `icon_type` varchar(50) DEFAULT 'expert',
  `section_type` enum('whatsapp','link','folder') DEFAULT 'whatsapp',
  `content` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: social_links
-- -----------------------------------------------
CREATE TABLE `social_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `handle` varchar(100) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: users
-- -----------------------------------------------
CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`),
  UNIQUE KEY `unique_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: vendors
-- -----------------------------------------------
CREATE TABLE `vendors` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `state` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `contactPerson` varchar(255) DEFAULT NULL,
  `contacts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contacts`)),
  `isHotelVendor` tinyint(1) NOT NULL DEFAULT 0,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: visas  (depends on: leads, employees)
-- -----------------------------------------------
CREATE TABLE `visas` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `passportNumber` varchar(255) DEFAULT NULL,
  `paymentStatus` varchar(255) DEFAULT NULL,
  `countryName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `companyName` varchar(255) DEFAULT NULL,
  `cityName` varchar(255) DEFAULT NULL,
  `visaFeesCurrency` varchar(255) DEFAULT NULL,
  `gstNumber` varchar(255) DEFAULT NULL,
  `referenceBy` varchar(255) DEFAULT NULL,
  `visaType` varchar(255) DEFAULT NULL,
  `travelers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`travelers`)),
  `timeLine` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`timeLine`)),
  `visaMode` varchar(255) DEFAULT NULL,
  `isGst` tinyint(1) DEFAULT 0,
  `gst` decimal(10,2) DEFAULT 0.00,
  `category` varchar(255) DEFAULT NULL,
  `vendorName` varchar(255) DEFAULT NULL,
  `vfsPayment` decimal(10,2) DEFAULT 0.00,
  `visaFees` decimal(10,2) DEFAULT 0.00,
  `serviceCharge` decimal(10,2) DEFAULT 0.00,
  `courierCharge` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `remark` text DEFAULT NULL,
  `clientPaymentStatus` varchar(255) DEFAULT NULL,
  `clientPaymentDate` datetime DEFAULT NULL,
  `vendorPaymentDate` datetime DEFAULT NULL,
  `visaApprovalDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `userId` (`userId`),
  CONSTRAINT `visas_ibfk_1` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visas_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -----------------------------------------------
-- Table: visa_travellers  (depends on: visas, employees)
-- -----------------------------------------------
CREATE TABLE `visa_travellers` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `visaId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `employeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `passportNumber` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Pending',
  `dateOfApproval` date DEFAULT NULL,
  `flagged` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `visaId` (`visaId`),
  KEY `employeeId` (`employeeId`),
  CONSTRAINT `visa_travellers_ibfk_1` FOREIGN KEY (`visaId`) REFERENCES `visas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visa_travellers_ibfk_2` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 5. Re-enable FK checks
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 6. Seed Data – Default Department, Admin & Employee
-- ============================================================

-- Default Department
INSERT INTO `departments` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES ('69e828ca-511a-4fdb-9a16-3bcb25585321', 'Sales', 'General Sales Department', NOW(), NOW());

-- Master Admin  (email: admin@hir.com | password: admin123)
INSERT INTO `employees` (`id`, `name`, `email`, `phone`, `password`, `isMaster`, `status`, `createdAt`, `updatedAt`)
VALUES ('724e5f45-0371-4d83-9234-b9d7026763ed', 'Master Admin', 'admin@hir.com', '1234567890', 'admin123', 1, 'active', NOW(), NOW());

-- Regular Employee  (email: employee@hir.com | password: emp123)
INSERT INTO `employees` (`id`, `name`, `email`, `phone`, `password`, `departmentId`, `isMaster`, `status`, `createdAt`, `updatedAt`)
VALUES ('6419030b-e53b-47ae-9e67-5ca8d33d9958', 'Test Employee', 'employee@hir.com', '0987654321', 'emp123', '69e828ca-511a-4fdb-9a16-3bcb25585321', 0, 'active', NOW(), NOW());

-- Default Company Settings
INSERT INTO `settings` (`company_name`, `company_tagline`, `company_caption`, `company_email`)
VALUES ('HIR International', 'Crafting Extraordinary Journeys', 'Domestic & International Travel Solutions', 'info@hirinternational.com');

-- ============================================================
-- Done! Database 'hir_international' is ready.
-- ============================================================
