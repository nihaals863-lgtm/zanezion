-- Migration to add assigned_admin_id to clients and subscription_requests tables
-- This ensures that SaaS clients can be correctly mapped to Operations Admins.

-- Add to clients table if missing
SET @row_count = (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'assigned_admin_id' AND table_schema = DATABASE());
SET @sql_clients = IF(@row_count = 0, 'ALTER TABLE clients ADD COLUMN assigned_admin_id INT NULL', 'SELECT "Column assigned_admin_id already exists in clients"');
PREPARE stmt_clients FROM @sql_clients;
EXECUTE stmt_clients;
DEALLOCATE PREPARE stmt_clients;

-- Add to subscription_requests table if missing
SET @row_count_sub = (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'subscription_requests' AND column_name = 'assigned_admin_id' AND table_schema = DATABASE());
SET @sql_sub = IF(@row_count_sub = 0, 'ALTER TABLE subscription_requests ADD COLUMN assigned_admin_id INT NULL', 'SELECT "Column assigned_admin_id already exists in subscription_requests"');
PREPARE stmt_sub FROM @sql_sub;
EXECUTE stmt_sub;
DEALLOCATE PREPARE stmt_sub;

-- Add foreign key constraints if they don't exist (Optional but recommended)
-- ALTER TABLE clients ADD CONSTRAINT fk_client_assigned_admin FOREIGN KEY (assigned_admin_id) REFERENCES users(id) ON DELETE SET NULL;
-- ALTER TABLE subscription_requests ADD CONSTRAINT fk_sub_assigned_admin FOREIGN KEY (assigned_admin_id) REFERENCES users(id) ON DELETE SET NULL;
