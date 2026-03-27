-- ZaneZion Institutional Database Schema

CREATE DATABASE IF NOT EXISTS zanezion_db;
USE zanezion_db;

-- 1. USERS (Centralized Auth & Profile)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    company_id INT DEFAULT NULL,
    role ENUM('super_admin', 'operations', 'procurement', 'inventory', 'logistics', 'finance', 'sales', 'support', 'Field Staff', 'Operational Staff', 'Concierge Manager', 'Logistics Lead', 'Inventory Manager', 'Client', 'Vendor') DEFAULT 'operations',
    status VARCHAR(50) DEFAULT 'Active',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 2. CLIENTS (SaaS & Enterprise Business Data)
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL, -- Link to auth record
    address TEXT,
    location VARCHAR(100),
    source VARCHAR(50) DEFAULT 'Manual',
    client_type ENUM('SaaS', 'Personal') DEFAULT 'Personal',
    plan VARCHAR(50) DEFAULT 'Starter',
    billing_cycle VARCHAR(50) DEFAULT 'Monthly',
    payment_method VARCHAR(50),
    contact_person VARCHAR(100),
    business_name VARCHAR(100),
    logo_url VARCHAR(255),
    primary_color VARCHAR(20),
    tagline VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2a. STAFF_DETAILS (Employment & Records)
CREATE TABLE IF NOT EXISTS staff_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    employment_status ENUM('Full-time', 'Contract', 'Part-time', 'Probation', 'Full Time', 'Part Time') DEFAULT 'Full Time',
    is_salaried BOOLEAN DEFAULT TRUE,
    vacation_balance INT DEFAULT 0,
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    routing_number VARCHAR(50),
    payment_method VARCHAR(50),
    nib_number VARCHAR(50),
    birthday DATE,
    has_passport BOOLEAN DEFAULT FALSE,
    has_license BOOLEAN DEFAULT FALSE,
    has_nib_doc BOOLEAN DEFAULT FALSE,
    has_police_record BOOLEAN DEFAULT FALSE,
    has_resume BOOLEAN DEFAULT FALSE,
    has_profile_pic BOOLEAN DEFAULT FALSE,
    has_certs BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. VENDORS
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NULL, -- Optional login for vendors
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    company_id INT DEFAULT NULL,
    address TEXT,
    category VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 4. WAREHOUSES
CREATE TABLE IF NOT EXISTS warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    manager_id INT,
    company_id INT DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 5. INVENTORY_ITEMS
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(20),
    quantity INT DEFAULT 0,
    threshold INT DEFAULT 10,
    warehouse_id INT,
    vendor_id INT,
    price DECIMAL(10, 2),
    inventory_type ENUM('Marketplace', 'Client') DEFAULT 'Marketplace',
    client_id INT,
    company_id INT DEFAULT NULL,
    status ENUM('in_stock', 'out_of_stock', 'low_stock') DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE SET NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    company_id INT,
    vendor_id INT,
    type VARCHAR(100) DEFAULT 'Custom Order',
    status ENUM('pending_review', 'approved', 'project_converted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending_review',
    total_amount DECIMAL(15, 2) DEFAULT 0.00,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES clients(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- 7. ORDER_ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NULL,
    name VARCHAR(255),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Assignments Table
CREATE TABLE IF NOT EXISTS staff_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignee_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    priority VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignee_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    company_id INT DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id INT,
    start_date DATE,
    end_date DATE,
    status ENUM('planned', 'in_progress', 'on_hold', 'completed') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (manager_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP NULL
);

-- 9. VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(100),
    type VARCHAR(50),
    company_id INT DEFAULT NULL,
    fuel_level INT DEFAULT 100,
    vehicle_type ENUM('Van', 'Boat', 'Truck', 'Car', 'Plane') DEFAULT 'Truck',
    status VARCHAR(50) DEFAULT 'available',
    capacity VARCHAR(50),
    insurance_policy VARCHAR(100),
    registration_expiry DATE,
    inspection_date DATE,
    diagnostic_status VARCHAR(100) DEFAULT 'Healthy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. ROUTES
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_location TEXT,
    end_location TEXT,
    distance_km DECIMAL(10, 2),
    estimated_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. MISSIONS (Operations Engine)
CREATE TABLE IF NOT EXISTS missions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    project_id INT,
    mission_type ENUM('Logistics', 'Chauffeur', 'Concierge') DEFAULT 'Logistics',
    event_date DATETIME NULL,
    status ENUM('pending', 'assigned', 'in_progress', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    assigned_driver INT NULL,
    vehicle_id INT NULL,
    route_id INT NULL,
    destination_type ENUM('Domestic', 'International', 'Private Island', 'Deep Sea') DEFAULT 'Domestic',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (assigned_driver) REFERENCES users(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11.1 MISSION_ITEMS
CREATE TABLE IF NOT EXISTS mission_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mission_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    qty INT DEFAULT 1,
    weight VARCHAR(50),
    length DECIMAL(10, 2),
    width DECIMAL(10, 2),
    height DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11.2 DELIVERIES (Logistics Execution)
CREATE TABLE IF NOT EXISTS deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mission_id INT NOT NULL,
    driver_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'en_route', 'delivered', 'failed') DEFAULT 'pending',
    delivery_date TIMESTAMP NULL,
    customs_clearance BOOLEAN DEFAULT FALSE,
    client_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11.3 PROOF_OF_DELIVERY
CREATE TABLE IF NOT EXISTS proof_of_delivery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mission_id INT NOT NULL,
    photo TEXT,
    signature VARCHAR(255),
    gps_coordinates VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 12. PURCHASE_REQUESTS
CREATE TABLE IF NOT EXISTS purchase_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NULL,
    requested_qty INT NULL,
    requester_id INT NULL,
    requester VARCHAR(255),
    items TEXT,
    priority VARCHAR(50),
    department VARCHAR(100),
    client_id INT NULL,
    company_id INT DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_by_id INT NULL,
    approval_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (requester_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 13. QUOTES
CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NULL,
    vendor_id INT NOT NULL,
    items TEXT,
    total DECIMAL(10, 2),
    lead_time VARCHAR(100),
    validity VARCHAR(100),
    company_id INT DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES purchase_requests(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 13.1 PURCHASE_ORDERS (Full PO System)
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    company_id INT DEFAULT NULL,
    vendor_name VARCHAR(255),
    total DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Pending', 'Partially Received', 'Completed') DEFAULT 'Pending',
    approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    approved_by_id INT NULL,
    approval_date TIMESTAMP NULL,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (company_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 13.2 PURCHASE_ORDER_ITEMS
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    ordered_qty INT NOT NULL,
    received_qty INT DEFAULT 0,
    price DECIMAL(10, 2),
    category VARCHAR(100),
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);

-- 14. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    mission_id INT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE,
    status ENUM('unpaid', 'partially_paid', 'paid', 'overdue', 'cancelled') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (mission_id) REFERENCES missions(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- 15. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- 16. PAYROLL
CREATE TABLE IF NOT EXISTS payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    base_salary DECIMAL(15, 2) DEFAULT 0.00,
    bonus DECIMAL(15, 2) DEFAULT 0.00,
    nib_deduction DECIMAL(15, 2) DEFAULT 0.00,
    medical_deduction DECIMAL(15, 2) DEFAULT 0.00,
    pension_deduction DECIMAL(15, 2) DEFAULT 0.00,
    savings_deduction DECIMAL(15, 2) DEFAULT 0.00,
    birthday_club DECIMAL(15, 2) DEFAULT 0.00,
    net_amount DECIMAL(15, 2) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL, -- Keep for compatibility if needed
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    method VARCHAR(50) DEFAULT 'Direct Deposit',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 16.1 SHIFTS (Staff Terminal)
CREATE TABLE IF NOT EXISTS shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    clock_in TIMESTAMP NULL,
    clock_out TIMESTAMP NULL,
    duration_hours DECIMAL(5, 2) DEFAULT 0.00,
    status ENUM('Active', 'Completed') DEFAULT 'Active',
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 17. EVENTS (Concierge)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location TEXT,
    event_date DATETIME,
    client_id INT,
    manager_id INT,
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- 18. GUEST_REQUESTS
CREATE TABLE IF NOT EXISTS guest_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    request_details TEXT NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'vip') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- 19. SUPPORT_TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 20. STOCK_MOVEMENTS
CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    type ENUM('in', 'out', 'adjustment') NOT NULL,
    reference_type ENUM('order', 'purchase', 'adjustment', 'delivery') NOT NULL,
    reference_id INT,
    user_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 21. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    module VARCHAR(100),
    resource_id INT,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 22. LUXURY_ITEMS
CREATE TABLE IF NOT EXISTS luxury_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    vault_location VARCHAR(100),
    estimated_value VARCHAR(50),
    status ENUM('Stored', 'In Transit', 'Released', 'Pending') DEFAULT 'Stored',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 23. ACCESS_PLANS
CREATE TABLE IF NOT EXISTS access_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50),
    price VARCHAR(50),
    period VARCHAR(50),
    yearly_price VARCHAR(50),
    description TEXT,
    features JSON,
    commitment VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --- SEED DATA ---

-- 1. USERS (Auth Records)
-- Passwords provided by user or generated for sample roles
-- superadmin: 123456
INSERT IGNORE INTO users (id, name, email, phone, password, role, status) VALUES 
(1, 'Super Admin', 'admin@zanezion.com', '1234567890', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'super_admin', 'active'),
(2, 'Concierge Manager', 'demo1@example.com', '242-555-0101', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'Concierge Manager', 'active'),
(3, 'Operations Lead', 'operation@example.com', '242-555-0102', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'operations', 'active'),
(4, 'Logistics Lead', 'logistics@example.com', '242-555-0103', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'Logistics Lead', 'active'),
(5, 'Field Staff Alpha', 'staff@example.com', '242-555-0104', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'Field Staff', 'active'),
(6, 'Procurement Officer', 'procurement@example.com', '242-555-0105', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'procurement', 'active'),
(7, 'Inventory Manager', 'inventory@example.com', '242-555-0106', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'Inventory Manager', 'active'),
(8, 'Enterprise Client', 'client11@example.com', '242-555-0107', '$2b$10$NMHc/e/749tXRmDvOkssPL3Tp9Grhy', 'Client', 'active');

-- 2. STAFF DETAILS (Employment Records for Users 1-7)
INSERT IGNORE INTO staff_details (user_id, employment_status, vacation_balance, is_available) VALUES 
(1, 'Full Time', 20, 1),
(2, 'Full Time', 15, 1),
(3, 'Full Time', 15, 1),
(4, 'Full Time', 15, 1),
(5, 'Part Time', 10, 1),
(6, 'Full Time', 12, 1),
(7, 'Full Time', 12, 1);

-- 3. CLIENTS (Linked to User 8)
INSERT IGNORE INTO clients (id, user_id, business_name, client_type, plan, status) VALUES 
(1, 8, 'Institutional Partner 11', 'SaaS', 'Enterprise', 'active');

-- 4. VENDORS
INSERT IGNORE INTO vendors (id, name, contact_name, email, category, status) VALUES 
(1, 'Global Logistics Corp', 'John Carter', 'contact@globallogistics.com', 'Shipping', 'active'),
(2, 'Elite Fleet Services', 'Sarah Miller', 'admin@elitefleet.com', 'Chauffeur', 'active');

-- 5. WAREHOUSES
INSERT IGNORE INTO warehouses (id, name, location, status) VALUES 
(1, 'Main Terminal A', 'Nassau Corporate District', 'active'),
(2, 'Logistics Hub B', 'Freeport Coastal Zone', 'active');

-- 6. INVENTORY ITEMS
INSERT IGNORE INTO inventory_items (name, sku, category, quantity, warehouse_id, vendor_id, price) VALUES 
( 'Industrial Generator G-400', 'GEN-400', 'Power Systems', 5, 1, 1, 12500.00),
( 'Luxury SUV Spare (R22)', 'TIRE-LX22', 'Fleet Maintenance', 12, 1, 2, 450.00),
( 'Secured Communication Module', 'SEC-COM-01', 'IT & Comms', 25, 2, 1, 890.00);

-- 7. SAMPLE ORDERS
INSERT IGNORE INTO orders (id, client_id, company_id, status, total_amount, notes) VALUES 
(1001, 8, 1, 'approved', 25000.00, 'Priority site setup request.'),
(1002, 8, 1, 'pending_review', 890.00, 'Routine equipment replacement.');

-- 8. ORDER ITEMS
INSERT IGNORE INTO order_items (order_id, item_id, name, quantity, unit_price, total_price) VALUES 
(1001, 1, 'Industrial Generator G-400', 2, 12500.00, 25000.00),
(1002, 3, 'Secured Communication Module', 1, 890.00, 890.00);

-- 9. MISSIONS
INSERT IGNORE INTO missions (id, order_id, mission_type, status, assigned_driver, destination_type, notes) VALUES
(5001, 1001, 'Logistics', 'in_progress', 5, 'Domestic', 'High-priority delivery for Industrial Generators'),
(5002, 1002, 'Logistics', 'completed', 5, 'Domestic', 'Routine IT comms delivery');

-- 10. MISSION ITEMS
INSERT IGNORE INTO mission_items (mission_id, item_name, qty, weight) VALUES
(5001, 'Industrial Generator G-400', 2, '2500kg'),
(5002, 'Secured Communication Module', 1, '5kg');

-- 11. DELIVERIES
INSERT IGNORE INTO deliveries (id, mission_id, driver_id, status) VALUES
(2001, 5001, 5, 'en_route'),
(2002, 5002, 5, 'delivered');

-- 12. INVOICES
INSERT IGNORE INTO invoices (id, order_id, mission_id, client_id, amount, status) VALUES
(3001, 1001, NULL, 1, 25000.00, 'unpaid'),
(3002, 1002, 5002, 1, 890.00, 'partially_paid');

-- 24. RBAC (Role Based Access Control)
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

-- SEED DATA FOR RBAC
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

-- Grant all permissions to super_admin (Role 1) for all menus (1-11)
INSERT IGNORE INTO role_menu_permissions (role_id, menu_id, can_view, can_add, can_edit, can_delete)
SELECT 1, id, 1, 1, 1, 1 FROM menus;

-- Grant standard permissions to client (Role 8) - dashboard, orders, concierge, settings
INSERT IGNORE INTO role_menu_permissions (role_id, menu_id, can_view, can_add, can_edit, can_delete) VALUES
(8, 1, 1, 0, 0, 0), -- Dashboard
(8, 2, 1, 1, 0, 0), -- Orders
(8, 6, 1, 1, 1, 0), -- Concierge
(8, 11, 1, 0, 1, 0); -- Settings
