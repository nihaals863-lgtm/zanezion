-- ============================================================
-- Migration: Fix Events Table for Multi-Tenant SaaS Isolation
-- Adds missing fields: company_id, guest_count, planner_name, special_notes
-- ============================================================

-- 1. Add company_id for tenant isolation (links to clients.id)
ALTER TABLE events ADD COLUMN IF NOT EXISTS company_id INT DEFAULT NULL AFTER manager_id;

-- 2. Add missing event detail fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS guest_count INT DEFAULT 0 AFTER status;
ALTER TABLE events ADD COLUMN IF NOT EXISTS planner_name VARCHAR(255) DEFAULT NULL AFTER guest_count;
ALTER TABLE events ADD COLUMN IF NOT EXISTS special_notes TEXT DEFAULT NULL AFTER planner_name;
ALTER TABLE events ADD COLUMN IF NOT EXISTS mood_board_url VARCHAR(500) DEFAULT NULL AFTER special_notes;

-- 3. Add foreign key for company_id (tenant isolation)
-- ALTER TABLE events ADD CONSTRAINT fk_events_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE SET NULL;

-- 4. Ensure clients table has client_type column with proper values
ALTER TABLE clients MODIFY COLUMN client_type ENUM('SaaS', 'Personal') DEFAULT 'Personal';

-- ============================================================
-- VERIFICATION: Run after migration
-- ============================================================
-- DESCRIBE events;
-- SELECT COUNT(*) FROM events;
