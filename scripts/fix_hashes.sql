-- Fix hashed passwords and email typos for ZaneZion seeded users
-- Run this on your production database (e.g., via Railway Shell or MySQL client)

USE railway;

-- 1. Fix Super Admin
UPDATE users SET password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'admin@zanezion.com';

-- 2. Fix Concierge Manager
UPDATE users SET password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'demo1@example.com';

-- 3. Fix Operations Lead (Fixing typo: opertion -> operation)
UPDATE users SET email = 'operation@example.com', password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'opertion@example.com';

-- 4. Fix Logistics Lead (Fixing typo: logistic -> logistics)
UPDATE users SET email = 'logistics@example.com', password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'logistic@example.com';

-- 5. Fix Field Staff Alpha
UPDATE users SET password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'staff@example.com';

-- 6. Fix Procurement Officer
UPDATE users SET password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'procurement@example.com';

-- 7. Fix Inventory Manager (Fixing typo: inventroy -> inventory)
UPDATE users SET email = 'inventory@example.com', password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'inventroy@example.com';

-- 8. Fix Enterprise Client (Fixing typo: exampel -> example)
UPDATE users SET email = 'client11@example.com', password = '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy' WHERE email = 'client11@exampel.com';

-- 9. Add Missing RBAC Tables
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS role_menu_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    menu_id INT NOT NULL,
    can_view BOOLEAN DEFAULT FALSE,
    can_add BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
    UNIQUE KEY (role_id, menu_id)
);

-- 10. Seed RBAC Data
INSERT IGNORE INTO roles (id, name, description) VALUES 
(1, 'super_admin', 'Full access to all modules'),
(2, 'concierge_manager', 'Access to concierge and event modules'),
(3, 'operations', 'Access to operational workflows'),
(4, 'logistics_lead', 'Fleet and mission management'),
(5, 'field_staff', 'Task and mission updates'),
(6, 'procurement', 'Purchase request and quote management'),
(7, 'inventory_manager', 'Warehouse and stock control'),
(8, 'client', 'Client portal access'),
(9, 'vendor', 'Vendor portal access');

INSERT IGNORE INTO menus (id, name, path, icon, sort_order) VALUES 
(1, 'Dashboard', '/dashboard', 'LayoutDashboard', 1),
(2, 'Orders', '/orders', 'ShoppingCart', 2),
(3, 'Procurement', '/procurement', 'ShoppingBag', 3),
(4, 'Inventory', '/inventory', 'Package', 4),
(5, 'Logistics', '/logistics', 'Truck', 5),
(6, 'Concierge', '/concierge', 'Heart', 6),
(7, 'Clients', '/clients', 'Users', 7),
(8, 'Vendors', '/vendors', 'Store', 8),
(9, 'Staff', '/staff', 'Smartphone', 9),
(10, 'Finance', '/finance', 'CircleDollarSign', 10),
(11, 'Settings', '/settings', 'Settings', 11);

-- Grant permissions
INSERT IGNORE INTO role_menu_permissions (role_id, menu_id, can_view, can_add, can_edit, can_delete)
SELECT 1, id, 1, 1, 1, 1 FROM menus;

INSERT IGNORE INTO role_menu_permissions (role_id, menu_id, can_view, can_add, can_edit, can_delete) VALUES
(8, 1, 1, 0, 0, 0), (8, 2, 1, 1, 0, 0), (8, 6, 1, 1, 1, 0), (8, 11, 1, 0, 1, 0);
