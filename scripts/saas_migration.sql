-- Fix bad ENUMs that cause ALTER TABLE to fail due to duplicate values (case-insensitivity in MySQL)
ALTER TABLE users MODIFY COLUMN status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE vehicles MODIFY COLUMN status VARCHAR(50) DEFAULT 'available';
ALTER TABLE payroll MODIFY COLUMN status VARCHAR(50) DEFAULT 'pending';

-- Add company_id (Tenant ID) to users
ALTER TABLE users ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE users ADD CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Add company_id to vendors
ALTER TABLE vendors ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE vendors ADD CONSTRAINT fk_vendor_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Add company_id to purchase_orders
ALTER TABLE purchase_orders ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_po_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Add company_id to warehouses
ALTER TABLE warehouses ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE warehouses ADD CONSTRAINT fk_warehouse_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Fix inventory_items (it has client_id, let's also add company_id for consistency and switch to it)
ALTER TABLE inventory_items ADD COLUMN company_id INT NULL AFTER client_id;
ALTER TABLE inventory_items ADD CONSTRAINT fk_ii_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;
UPDATE inventory_items SET company_id = client_id WHERE client_id IS NOT NULL;

-- Add company_id to vehicles
ALTER TABLE vehicles ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE vehicles ADD CONSTRAINT fk_vehicle_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Add company_id to projects
ALTER TABLE projects ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE projects ADD CONSTRAINT fk_project_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Add company_id to purchase_requests (it has client_id, we will add company_id)
ALTER TABLE purchase_requests ADD COLUMN company_id INT NULL AFTER client_id;
ALTER TABLE purchase_requests ADD CONSTRAINT fk_pr_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;
UPDATE purchase_requests SET company_id = client_id WHERE client_id IS NOT NULL;

-- Add company_id to quotes
ALTER TABLE quotes ADD COLUMN company_id INT NULL AFTER id;
ALTER TABLE quotes ADD CONSTRAINT fk_quote_company FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Add approval columns to purchase_orders for Phase 2
ALTER TABLE purchase_orders ADD COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending' AFTER status;
ALTER TABLE purchase_orders ADD COLUMN approved_by_id INT NULL AFTER approval_status;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_po_approver FOREIGN KEY (approved_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE purchase_orders ADD COLUMN approval_date TIMESTAMP NULL AFTER approved_by_id;

-- Add approval columns to purchase_requests for Phase 2
ALTER TABLE purchase_requests ADD COLUMN approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending' AFTER status;
ALTER TABLE purchase_requests ADD COLUMN approved_by_id INT NULL AFTER approval_status;
ALTER TABLE purchase_requests ADD CONSTRAINT fk_pr_approver FOREIGN KEY (approved_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE purchase_requests ADD COLUMN approval_date TIMESTAMP NULL AFTER approved_by_id;
