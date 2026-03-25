-- Fix clients table schema mismatches to prevent 500 errors (Data Truncation)
-- Run this script to update existing database schema to match the new VARCHAR columns

USE railway;

-- 1. Modify plan column
ALTER TABLE clients MODIFY COLUMN plan VARCHAR(50) DEFAULT 'Starter';

-- 2. Modify billing_cycle column
ALTER TABLE clients MODIFY COLUMN billing_cycle VARCHAR(50) DEFAULT 'Monthly';

-- 3. Modify status column
ALTER TABLE clients MODIFY COLUMN status VARCHAR(50) DEFAULT 'active';

-- Optional: Update any existing invalid data (if any) or just leave it as is since VARCHAR is permissive
