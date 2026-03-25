-- ZaneZion Staff Documents Schema Upgrade
-- This file adds necessary storage columns for staff onboarding documents.
-- Run these queries in your MySQL Database (ZaneZion).

USE zanezion;

-- Add document URL columns to store file paths after upload
ALTER TABLE staff_details 
ADD COLUMN passport_url VARCHAR(500) DEFAULT NULL AFTER nib_number,
ADD COLUMN license_url VARCHAR(500) DEFAULT NULL AFTER passport_url,
ADD COLUMN nib_document_url VARCHAR(500) DEFAULT NULL AFTER license_url,
ADD COLUMN police_record_url VARCHAR(500) DEFAULT NULL AFTER nib_document_url,
ADD COLUMN profile_pic_url VARCHAR(500) DEFAULT NULL AFTER police_record_url;

-- Optional: Ensure users table has a 'Pending' status supported
-- Mostly users status is already VARCHAR(100), but checking is good.
-- UPDATE users SET status = 'Pending' WHERE role = 'staff' AND status = 'Inactive';
