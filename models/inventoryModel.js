const db = require('../config/db');

class InventoryItem {
    static async create(data) {
        const { name, sku, description, category, unit, quantity, threshold, warehouse_id, vendor_id, price, inventory_type, client_id } = data;

        const params = [
            name || null,
            sku || null,
            description || null,
            category || null,
            unit || null,
            quantity ?? 0,
            threshold ?? 10,
            warehouse_id || 1,
            vendor_id || null,
            price || 0,
            inventory_type || 'Marketplace',
            client_id || null,
            data.company_id || null
        ];
 
        const [result] = await db.query(
            'INSERT INTO inventory_items (name, sku, description, category, unit, quantity, threshold, warehouse_id, vendor_id, price, inventory_type, client_id, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            params
        );
        return result.insertId;
    }

    static async getAll(companyId) {
        let query = `
            SELECT i.*, w.name as warehouse_name, v.name as vendor_name, c.business_name as client_name
            FROM inventory_items i
            LEFT JOIN warehouses w ON i.warehouse_id = w.id
            LEFT JOIN vendors v ON i.vendor_id = v.id
            LEFT JOIN clients c ON i.client_id = c.id
            WHERE i.deleted_at IS NULL
        `;
        const params = [];

        if (companyId !== undefined) {
             if (companyId === null) {
                 // Super Admin: return ALL inventory (Global HQ view)
             } else {
                 // Tenant: their stock + Marketplace
                 query += ' AND (i.inventory_type = "Marketplace" OR i.company_id = ?)';
                 params.push(companyId);
             }
        }

        const [rows] = await db.query(query, params);
        return rows.map(i => ({
            ...i,
            quantity: Number(i.quantity || 0),
            price: Number(i.price || 0)
        }));
    }

    static async getById(id) {
        const [rows] = await db.query(`
            SELECT i.*, w.name as warehouse_name, v.name as vendor_name, c.business_name as client_name
            FROM inventory_items i
            LEFT JOIN warehouses w ON i.warehouse_id = w.id
            LEFT JOIN vendors v ON i.vendor_id = v.id
            LEFT JOIN clients c ON i.client_id = c.id
            WHERE i.id = ? AND i.deleted_at IS NULL
        `, [id]);
        if (!rows[0]) return null;
        return {
            ...rows[0],
            quantity: Number(rows[0].quantity || 0),
            price: Number(rows[0].price || 0)
        };
    }

    static async update(id, updateData) {
        const allowedFields = ['name', 'sku', 'description', 'category', 'unit', 'quantity', 'threshold', 'warehouse_id', 'vendor_id', 'price', 'inventory_type', 'client_id', 'status'];

        // Filter out undefined values and non-whitelisted fields to avoid SQL errors
        const data = Object.entries(updateData)
            .filter(([key, value]) => value !== undefined && allowedFields.includes(key))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        if (Object.keys(data).length === 0) return true;

        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.query(`UPDATE inventory_items SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async adjustStock(id, qty, type, reference_type, reference_id, user_id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Normalize type to match DB ENUM: 'in', 'out', 'adjustment'
            const typeMap = { 'in': 'in', 'entry': 'in', 'add': 'in', 'out': 'out', 'issue': 'out', 'remove': 'out', 'adjustment': 'adjustment', 'adjust': 'adjustment' };
            const normalizedType = typeMap[(type || '').toLowerCase()] || 'adjustment';

            // Update quantity
            const operator = ['in', 'entry'].includes(type) ? '+' : '-';
            await connection.query(
                `UPDATE inventory_items SET quantity = quantity ${operator} ? WHERE id = ?`,
                [qty, id]
            );

            // Update status based on threshold
            const [item] = await connection.query('SELECT quantity, threshold FROM inventory_items WHERE id = ?', [id]);
            const newQty = item[0].quantity;
            const threshold = item[0].threshold;
            let status = 'in_stock';
            if (newQty <= 0) status = 'out_of_stock';
            else if (newQty < threshold) status = 'low_stock';

            await connection.query('UPDATE inventory_items SET status = ? WHERE id = ?', [status, id]);

            // Log stock movement
            await connection.query(
                'INSERT INTO stock_movements (item_id, quantity, type, reference_type, reference_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [id, qty, normalizedType, reference_type, reference_id, user_id]
            );

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    static async softDelete(id) {
        const [result] = await db.query('UPDATE inventory_items SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = InventoryItem;
