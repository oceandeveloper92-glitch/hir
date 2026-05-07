-- Flyway Migration: Create incentive_settings table
-- Version: V4__create_incentive_settings_table.sql

CREATE TABLE IF NOT EXISTS `incentive_settings` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `monthYear` DATETIME NOT NULL,
  `airTicketBaseAmount` DECIMAL(10, 2) NOT NULL,
  `airTicketIncentivePercentage` DECIMAL(5, 2) NOT NULL,
  `visaIncentivePerFileAmount` DECIMAL(10, 2) NOT NULL,
  `minimumFileCount` INT DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
