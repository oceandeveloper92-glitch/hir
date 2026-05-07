-- Flyway Migration: Add new fields to passports table
-- Version: V1__add_passport_fields.sql

-- Add Lead tracking fields
ALTER TABLE `passports` 
ADD COLUMN `date` DATETIME NULL AFTER `referenceBy`,
ADD COLUMN `leadStatus` VARCHAR(255) NULL AFTER `date`,
ADD COLUMN `phoneNumber` VARCHAR(255) NULL AFTER `leadStatus`,
ADD COLUMN `leadSource` VARCHAR(255) NULL AFTER `phoneNumber`,
ADD COLUMN `remark` TEXT NULL AFTER `leadSource`,
ADD COLUMN `assignedTo` VARCHAR(255) NULL AFTER `remark`;

-- Add Process tracking fields
ALTER TABLE `passports`
ADD COLUMN `processDate` DATETIME NULL AFTER `assignedTo`,
ADD COLUMN `processStatus` VARCHAR(255) NULL AFTER `processDate`,
ADD COLUMN `processRemark` TEXT NULL AFTER `processStatus`;

-- Add Portal credentials fields
ALTER TABLE `passports`
ADD COLUMN `portalId` VARCHAR(255) NULL AFTER `processRemark`,
ADD COLUMN `portalPassword` VARCHAR(255) NULL AFTER `portalId`,
ADD COLUMN `portalLink` VARCHAR(500) NULL AFTER `portalPassword`;
