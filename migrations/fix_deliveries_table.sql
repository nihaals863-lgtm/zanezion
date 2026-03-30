-- Migration: Align deliveries table with model code
-- The original schema only had (mission_id, driver_id, status) but the model uses many more columns
-- This migration adds the missing columns so create/getAll/delete all work on the same table
-- Run: mysql -u root -p database_name < migrations/fix_deliveries_table.sql

-- 1. Add missing columns to deliveries table
ALTER TABLE deliveries
    ADD COLUMN IF NOT EXISTS order_id INT NULL AFTER id,
    ADD COLUMN IF NOT EXISTS project_id INT NULL AFTER order_id,
    ADD COLUMN IF NOT EXISTS vehicle_id INT NULL AFTER project_id,
    ADD COLUMN IF NOT EXISTS route_id INT NULL AFTER driver_id,
    ADD COLUMN IF NOT EXISTS mission_type VARCHAR(100) DEFAULT 'Logistics' AFTER route_id,
    ADD COLUMN IF NOT EXISTS passenger_info JSON NULL,
    ADD COLUMN IF NOT EXISTS package_details JSON NULL,
    ADD COLUMN IF NOT EXISTS destination_type ENUM('Domestic', 'International', 'Private Island', 'Deep Sea') DEFAULT 'Domestic',
    ADD COLUMN IF NOT EXISTS route VARCHAR(500) NULL,
    ADD COLUMN IF NOT EXISTS custom_route TEXT NULL,
    ADD COLUMN IF NOT EXISTS proof_of_delivery_signature TEXT NULL,
    ADD COLUMN IF NOT EXISTS proof_of_delivery_photo TEXT NULL,
    ADD COLUMN IF NOT EXISTS pod JSON NULL;

-- 2. Make mission_id nullable (deliveries can now be created without a mission)
ALTER TABLE deliveries MODIFY COLUMN mission_id INT NULL DEFAULT NULL;

-- 3. Make driver_id nullable (can be assigned later)
ALTER TABLE deliveries MODIFY COLUMN driver_id INT NULL DEFAULT NULL;

-- 4. Update status ENUM to match all statuses used by the model and frontend
ALTER TABLE deliveries MODIFY COLUMN status VARCHAR(50) DEFAULT 'Pending';

-- 5. Create delivery_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS delivery_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    delivery_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    qty INT DEFAULT 1,
    weight VARCHAR(50) NULL,
    length DECIMAL(10, 2) NULL,
    width DECIMAL(10, 2) NULL,
    height DECIMAL(10, 2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
