const db = require('../config/db');

class PurchaseOrder {
    static async create(data) {
        // Accept both camelCase (frontend) and snake_case field names
        const vendorIdRaw = data.vendor_id || data.vendorId;
        const vendorName = data.vendor_name || data.vendorName;
        const total = data.total_amount || data.total || 0;
        const items = data.items;
        const date = data.date || new Date().toISOString().split('T')[0];
        const companyId = data.companyId || data.company_id || null;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Resolve vendor_id: if it's a valid integer use it directly,
            // otherwise look up the vendor by name in the DB
            let resolvedVendorId = null;
            if (vendorIdRaw && !isNaN(Number(vendorIdRaw))) {
                resolvedVendorId = Number(vendorIdRaw);
            } else if (vendorName) {
                const [vendorRows] = await connection.execute(
                    'SELECT id FROM vendors WHERE name = ? LIMIT 1',
                    [vendorName]
                );
                if (vendorRows.length > 0) {
                    resolvedVendorId = vendorRows[0].id;
                }
            }

            // If still no vendor found, try a broader search
            if (!resolvedVendorId && vendorIdRaw) {
                const [vendorRows] = await connection.execute(
                    'SELECT id FROM vendors LIMIT 1'
                );
                if (vendorRows.length > 0) {
                    resolvedVendorId = vendorRows[0].id;
                }
            }

            if (!resolvedVendorId) {
                throw new Error('Could not resolve vendor. Please ensure at least one vendor exists in the system.');
            }

            const [result] = await connection.execute(
                'INSERT INTO purchase_orders (vendor_id, vendor_name, total, status, date, company_id, approval_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [resolvedVendorId, vendorName || null, total, 'Pending', date, companyId, 'Pending']
            );

            const poId = result.insertId;

            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await connection.execute(
                        'INSERT INTO purchase_order_items (po_id, name, ordered_qty, received_qty, price, category) VALUES (?, ?, ?, ?, ?, ?)',
                        [poId, item.name || null, item.quantity || item.orderedQty || item.qty || 0, 0, item.unit_price || item.price || 0, item.category || null]
                    );
                }
            }

            await connection.commit();
            return poId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(companyId = null) {
        let query = `SELECT po.*, v.name AS resolved_vendor_name 
             FROM purchase_orders po 
             LEFT JOIN vendors v ON po.vendor_id = v.id`;
        const params = [];
        
        if (companyId) {
            query += ` WHERE po.company_id = ?`;
            params.push(companyId);
        }
        
        query += ` ORDER BY po.created_at DESC`;

        const [rows] = await db.execute(query, params);
        const results = [];
        for (const row of rows) {
            const [itemRows] = await db.execute('SELECT * FROM purchase_order_items WHERE po_id = ?', [row.id]);
            results.push({
                id: row.id,
                vendorId: row.vendor_id,
                vendorName: row.resolved_vendor_name || row.vendor_name || 'Unknown Vendor',
                total: row.total,
                status: row.status,
                approvalStatus: row.approval_status,
                companyId: row.company_id,
                date: row.date,
                items: itemRows.map(item => ({
                    id: item.id,
                    name: item.name,
                    orderedQty: item.ordered_qty,
                    receivedQty: item.received_qty,
                    pendingQty: item.ordered_qty - item.received_qty,
                    price: item.price,
                    category: item.category
                }))
            });
        }
        return results;
    }

    static async getById(id, companyId = null) {
        let query = `SELECT po.*, v.name AS resolved_vendor_name 
             FROM purchase_orders po 
             LEFT JOIN vendors v ON po.vendor_id = v.id 
             WHERE po.id = ?`;
        const params = [id];
             
        if (companyId) {
            query += ` AND po.company_id = ?`;
            params.push(companyId);
        }
             
        const [poRows] = await db.execute(query, params);
        if (poRows.length === 0) return null;
        const row = poRows[0];

        const [itemRows] = await db.execute('SELECT * FROM purchase_order_items WHERE po_id = ?', [id]);
        return {
            id: row.id,
            vendorId: row.vendor_id,
            vendorName: row.resolved_vendor_name || row.vendor_name || 'Unknown Vendor',
            total: row.total,
            status: row.status,
            approvalStatus: row.approval_status,
            companyId: row.company_id,
            date: row.date,
            items: itemRows.map(item => ({
                id: item.id,
                name: item.name,
                orderedQty: item.ordered_qty,
                receivedQty: item.received_qty,
                pendingQty: item.ordered_qty - item.received_qty,
                price: item.price,
                category: item.category
            }))
        };
    }

    static async receiveItems(poId, receivedItems) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            for (const item of receivedItems) {
                // Update received_qty in PO items
                await connection.execute(
                    'UPDATE purchase_order_items SET received_qty = received_qty + ? WHERE po_id = ? AND id = ?',
                    [item.receivedNow, poId, item.id]
                );

                if (item.receivedNow > 0) {
                    // Check if item exists in inventory
                    const [existing] = await connection.execute('SELECT id FROM inventory WHERE name = ? LIMIT 1', [item.name || '']);
                    if (existing.length > 0) {
                        await connection.execute('UPDATE inventory SET quantity = quantity + ?, status = "in_stock" WHERE id = ?', [item.receivedNow, existing[0].id]);
                    } else {
                        // Insert new item
                        const category = item.category || 'Procurement';
                        const price = item.price || 0;
                        await connection.execute(
                            'INSERT INTO inventory (name, category, price, quantity, status) VALUES (?, ?, ?, ?, ?)',
                            [item.name || 'Unknown Item', category, price, item.receivedNow, 'in_stock']
                        );
                    }
                }
            }

            // Check if PO is fully received
            const [items] = await connection.execute('SELECT ordered_qty, received_qty FROM purchase_order_items WHERE po_id = ?', [poId]);
            const isFullyReceived = items.every(i => i.received_qty >= i.ordered_qty);
            const isPartiallyReceived = items.some(i => i.received_qty > 0);

            let status = 'Pending';
            if (isFullyReceived) status = 'Completed';
            else if (isPartiallyReceived) status = 'Partially Received';

            await connection.execute('UPDATE purchase_orders SET status = ? WHERE id = ?', [status, poId]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, updateData, companyId = null) {
        const allowedFields = ['status', 'approval_status', 'vendor_id', 'vendor_name', 'total', 'date', 'approved_by_id', 'approval_date'];
        const data = {};
        Object.keys(updateData).forEach(key => {
            // Handle both camelCase and snake_case
            let dbField = key;
            if (key === 'vendorId') dbField = 'vendor_id';
            if (key === 'vendorName') dbField = 'vendor_name';
            if (key === 'totalAmount') dbField = 'total';
            if (key === 'approvalStatus') dbField = 'approval_status';

            if (allowedFields.includes(dbField) && updateData[key] !== undefined) {
                data[dbField] = updateData[key];
            }
        });

        if (Object.keys(data).length === 0) return true;

        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        
        let query = `UPDATE purchase_orders SET ${fields} WHERE id = ?`;
        if (companyId) {
            query += ` AND company_id = ?`;
            values.push(companyId);
        }
        
        const [result] = await db.execute(query, values);
        return result.affectedRows > 0;
    }
}

class PurchaseRequest {
    static async create(data) {
        const { requester, items, priority, status, department, clientId } = data;
        const [result] = await db.execute(
            'INSERT INTO purchase_requests (requester, items, priority, status, department, client_id) VALUES (?, ?, ?, ?, ?, ?)',
            [requester, JSON.stringify(items), priority || 'Normal', status || 'Pending', department || null, clientId || null]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM purchase_requests ORDER BY created_at DESC');
        return rows.map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM purchase_requests WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return { ...rows[0], items: JSON.parse(rows[0].items || '[]') };
    }

    static async update(id, updateData) {
        const allowedFields = ['status', 'priority', 'items', 'department', 'client_id'];
        const data = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                data[key] = key === 'items' && typeof updateData[key] !== 'string' 
                    ? JSON.stringify(updateData[key]) 
                    : updateData[key];
            }
        });

        if (Object.keys(data).length === 0) return true;
        
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.execute(`UPDATE purchase_requests SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM purchase_requests WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

class Quote {
    static async create(data) {
        const { vendorId, items, total, status, leadTime, validity } = data;
        const [result] = await db.execute(
            'INSERT INTO quotes (vendor_id, items, total, status, lead_time, validity) VALUES (?, ?, ?, ?, ?, ?)',
            [vendorId, JSON.stringify(items), total, status || 'Active', leadTime || null, validity || null]
        );
        return result.insertId;
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM quotes ORDER BY created_at DESC');
        return rows.map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
    }

    static async getById(id) {
        const [rows] = await db.execute('SELECT * FROM quotes WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        return { ...rows[0], items: JSON.parse(rows[0].items || '[]') };
    }

    static async update(id, updateData) {
        const allowedFields = ['status', 'total', 'items', 'lead_time', 'validity'];
        const data = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                data[key] = key === 'items' && typeof updateData[key] !== 'string' 
                    ? JSON.stringify(updateData[key]) 
                    : updateData[key];
            }
        });

        if (Object.keys(data).length === 0) return true;
        
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.execute(`UPDATE quotes SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM quotes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = { PurchaseOrder, PurchaseRequest, Quote };

