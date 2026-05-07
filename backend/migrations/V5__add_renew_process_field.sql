-- Flyway Migration: Add renewProcess JSON field to passports table
-- Version: V3__add_renew_process_field.sql

-- Add renewProcess field to store process activity timeline
ALTER TABLE `passports` 
ADD COLUMN `renewProcess` JSON NULL AFTER `status`;

-- Set default empty array for existing records
UPDATE `passports` 
SET `renewProcess` = JSON_ARRAY() 
WHERE `renewProcess` IS NULL;
