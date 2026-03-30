-- Migration: Make order_id nullable in projects table
-- Projects can be created independently without an order
-- Run: mysql -u root -p database_name < migrations/fix_projects_nullable_order_id.sql

ALTER TABLE projects MODIFY COLUMN order_id INT NULL DEFAULT NULL;
