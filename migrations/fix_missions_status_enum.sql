-- Migration: Add 'en_route' to missions status ENUM
-- Frontend sends 'en_route' when dispatching a mission but it was missing from the ENUM
-- Run: mysql -u root -p database_name < migrations/fix_missions_status_enum.sql

ALTER TABLE missions MODIFY COLUMN status ENUM('pending', 'assigned', 'in_progress', 'en_route', 'completed', 'failed', 'cancelled') DEFAULT 'pending';
