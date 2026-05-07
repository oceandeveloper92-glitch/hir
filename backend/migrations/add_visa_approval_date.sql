-- Database Migration: Add visaApprovalDate column to visas table
-- Execute this SQL query in your MySQL database

-- Add visaApprovalDate column to the visas table
ALTER TABLE `visas` 
ADD COLUMN `visaApprovalDate` DATETIME NULL AFTER `vendorPaymentDate`;

-- Optional: Add an index for better query performance if you'll be filtering by this date
-- CREATE INDEX idx_visaApprovalDate ON visas(visaApprovalDate);
