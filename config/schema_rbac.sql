-- RBAC Migration Script
USE zanezion_db;

-- 1. ROLES Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERMISSIONS Table
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ROLE_PERMISSIONS (Pivot Table)
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 4. INSERT DEFAULT ROLES
INSERT IGNORE INTO roles (name, description) VALUES 
('super_admin', 'Full system access'),
('operations', 'Manage deliveries and staff'),
('procurement', 'Manage quotes and POs'),
('inventory', 'Manage stock and warehouses'),
('logistics', 'Manage missions and vehicles'),
('finance', 'Manage invoices and payroll'),
('client', 'Access client portal'),
('staff', 'Access employee portal');

-- 5. INSERT DEFAULT PERMISSIONS
INSERT IGNORE INTO permissions (name, description) VALUES 
('manage_users', 'Create and edit users'),
('manage_roles', 'Manage roles and permissions'),
('view_procurement', 'View quotes and POs'),
('edit_procurement', 'Create and edit POs'),
('manage_inventory', 'Manage warehouse items'),
('manage_logistics', 'Dispatch missions'),
('view_finance', 'View reports and invoices'),
('manage_finance', 'Process payroll and settle invoices');

-- 6. LINK PERMISSIONS TO SUPER ADMIN (Example)
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'super_admin';
