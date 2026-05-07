-- Database Migration: Update visa fields
-- 1. Rename stateName to gstNumber
-- 2. Change isGst default value to false (0)
-- Execute this SQL query in your MySQL database

-- Rename stateName column to gstNumber
ALTER TABLE `visas` 
CHANGE COLUMN `stateName` `gstNumber` VARCHAR(255) NULL DEFAULT NULL;

-- Update isGst default value to false (0)
-- Note: This only affects new records. Existing records will keep their current values.
ALTER TABLE `visas` 
MODIFY COLUMN `isGst` TINYINT(1) NOT NULL DEFAULT 0;

-- Optional: If you want to update existing records to have isGst = false, uncomment the line below
-- UPDATE `visas` SET `isGst` = 0 WHERE `isGst` IS NULL;
