-- Fix staff-related tables schema mismatches to prevent 500 errors (Data Truncation)
-- Run this script to update existing database schema to match the new VARCHAR columns

USE railway;

-- 1. Modify leave_requests table
ALTER TABLE leave_requests MODIFY COLUMN type VARCHAR(50) NOT NULL;
ALTER TABLE leave_requests MODIFY COLUMN status VARCHAR(50) DEFAULT 'pending';

-- 2. Modify staff_assignments table
ALTER TABLE staff_assignments MODIFY COLUMN priority VARCHAR(50) DEFAULT 'Medium';
ALTER TABLE staff_assignments MODIFY COLUMN status VARCHAR(50) DEFAULT 'pending';
