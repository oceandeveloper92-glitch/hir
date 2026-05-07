-- Migration: Add isHotelVendor column to vendors table
-- Description: Adds a boolean field to distinguish hotel vendors from regular vendors
-- Date: 2025

-- Add isHotelVendor column to vendors table
-- Note: If column already exists, you may need to modify it instead
-- ALTER TABLE vendors MODIFY COLUMN isHotelVendor TINYINT(1) NOT NULL DEFAULT 0 AFTER contacts;

ALTER TABLE vendors 
ADD COLUMN isHotelVendor TINYINT(1) NOT NULL DEFAULT 0 
AFTER contacts;

-- Add comment to the column
ALTER TABLE vendors 
MODIFY COLUMN isHotelVendor TINYINT(1) NOT NULL DEFAULT 0 
COMMENT 'Indicates if the vendor is a hotel vendor (1) or regular vendor (0)';

