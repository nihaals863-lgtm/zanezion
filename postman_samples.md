# ZaneZion Institutional Backend - Postman Sample Request Bodies

### 1. AUTHENTICATION

**POST /api/auth/register**
```json
{
  "name": "Super Admin",
  "email": "admin@zanezion.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "super_admin"
}
```

**POST /api/auth/login**
```json
{
  "email": "admin@zanezion.com",
  "password": "password123"
}
```

---

### 2. CLIENTS & VENDORS

**POST /api/clients**
```json
{
  "name": "Luxury Hotels Corp",
  "email": "contact@luxuryhotels.com",
  "phone": "9876543210",
  "password": "clientPassword123",
  "address": "123 Elite Plaza, Paris"
}
```

**POST /api/vendors**
```json
{
  "name": "Elite Supplies Ltd",
  "contact_name": "John Doe",
  "email": "sales@elitesupplies.com",
  "phone": "5550199",
  "address": "45 Industrial Ave",
  "category": "Furniture"
}
```

---

### 3. INVENTORY & WAREHOUSES

**POST /api/warehouses**
```json
{
  "name": "Main Central Warehouse",
  "location": "North Zone, Plot 5",
  "manager_id": 1
}
```

**POST /api/inventory**
```json
{
  "name": "Executive Leather Chair",
  "sku": "CH-LUX-001",
  "description": "Ergonomic leather chair for executives",
  "category": "Office Furniture",
  "unit": "pcs",
  "quantity": 50,
  "threshold": 10,
  "warehouse_id": 1,
  "price": 450.00
}
```

**POST /api/inventory/:id/adjust**
```json
{
  "quantity": 5,
  "type": "out",
  "reference_type": "order",
  "reference_id": 101
}
```

---

### 4. ORDERS & PROJECTS

**POST /api/orders**
```json
{
  "client_id": 2,
  "company_id": 1,
  "notes": "Urgent order for the new lobby",
  "items": [
    {
      "item_id": 1,
      "quantity": 10,
      "unit_price": 450.00
    }
  ]
}
```

**POST /api/orders/convert/:orderId**
```json
{
  "name": "Lobby Decoration Project",
  "description": "Setup furniture for the main lobby",
  "manager_id": 3,
  "start_date": "2026-04-01",
  "end_date": "2026-04-15"
}
```

---

### 5. LOGISTICS & DELIVERY

**POST /api/logistics/deliveries**
```json
{
  "project_id": 1,
  "order_id": 1,
  "vehicle_id": 1,
  "driver_id": 5,
  "route_id": 1
}
```

**PATCH /api/logistics/deliveries/:id/status**
```json
{
  "status": "delivered",
  "signature": "data:image/png;base64,ivbor...",
  "photo": "https://bucket.s3.com/pod.jpg"
}
```

---

### 6. FINANCE & PAYROLL

**POST /api/finance/invoices/:id/pay**
```json
{
  "amount": 4500.00,
  "payment_method": "Bank Transfer",
  "transaction_id": "TXN_998877"
}
```

**POST /api/finance/payroll**
```json
{
  "user_id": 5,
  "amount": 2500.00,
  "bonus": 200.00,
  "payment_date": "2026-03-31"
}
```
