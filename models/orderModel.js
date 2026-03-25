const db = require('../config/db');

class Order {
    static async create(orderData, items) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Accept both camelCase (frontend) and snake_case field names
            const clientId = orderData.clientId || orderData.client_id || null;
            const companyId = orderData.companyId || orderData.company_id || clientId;
            const vendorId = orderData.vendorId || orderData.vendor_id || null;
            const type = orderData.type || 'Custom Order';
            const notes = orderData.notes || null;
            const totalAmount = orderData.total_amount || orderData.total || orderData.totalAmount || 0;
            let status = orderData.status || 'pending_review';
            if (status.toLowerCase() === 'pending') status = 'pending_review';

            const dueDate = orderData.dueDate || orderData.due_date || null;
            const orderDate = orderData.requestDate || orderData.orderDate || orderData.order_date || new Date().toISOString().split('T')[0];

            // Use a default user for client_id (required FK to users table)
            let userClientId = null;
            if (clientId) {
                // Determine if clientId represents a users.id or clients.id
                // typically, we assume it's a clients.id coming from the frontend dropdown
                const [clientRows] = await connection.execute(
                    'SELECT user_id FROM clients WHERE id = ? LIMIT 1', [clientId]
                );
                if (clientRows.length > 0) {
                    userClientId = clientRows[0].user_id;
                } else {
                    // It might already be a user id, let's verify
                    const [userRows] = await connection.execute(
                        'SELECT id FROM users WHERE id = ? LIMIT 1', [clientId]
                    );
                    if (userRows.length > 0) userClientId = userRows[0].id;
                }
            }

            if (!userClientId) {
                const [fallbackRows] = await connection.execute('SELECT id FROM users LIMIT 1');
                userClientId = fallbackRows.length > 0 ? fallbackRows[0].id : 1;
            }

            const [orderResult] = await connection.execute(
                'INSERT INTO orders (client_id, company_id, vendor_id, type, notes, total_amount, status, due_date, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userClientId, companyId || null, vendorId || null, type, notes, totalAmount, status, dueDate, orderDate]
            );
            const orderId = orderResult.insertId;

            // Insert Items
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    const item_id = item.item_id || item.id || null;
                    const name = item.name || item.product || null;
                    const quantity = item.quantity || item.qty || 0;
                    const unit_price = item.unit_price || item.price || 0;
                    const totalPrice = quantity * unit_price;

                    await connection.execute(
                        'INSERT INTO order_items (order_id, item_id, name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
                        [orderId, (typeof item_id === 'number' ? item_id : null), name, quantity, unit_price, totalPrice]
                    );
                }
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(companyId) {
        let query = `
            SELECT o.*, COALESCE(c.business_name, u.name) AS client_name, c.client_type, v.name AS vendor_name 
             FROM orders o 
             LEFT JOIN clients c ON o.company_id = c.id 
             LEFT JOIN users u ON o.client_id = u.id
             LEFT JOIN vendors v ON o.vendor_id = v.id
             WHERE o.deleted_at IS NULL
        `;
        const params = [];

        if (companyId !== undefined) {
            if (companyId === null) {
                // Super Admin: return ALL orders platform-wide
            } else {
                // Return specific tenant orders
                query += ' AND o.company_id = ?';
                params.push(companyId);
            }
        }

        query += ' ORDER BY o.created_at DESC';

        const [rows] = await db.execute(query, params);
        const results = [];
        for (const row of rows) {
            const [items] = await db.execute(
                `SELECT oi.*, COALESCE(ii.name, oi.name) as item_name 
                 FROM order_items oi 
                 LEFT JOIN inventory_items ii ON oi.item_id = ii.id 
                 WHERE oi.order_id = ?`,
                [row.id]
            );
            results.push({
                ...row,
                clientId: row.company_id || row.client_id,
                client: row.client_name || 'Individual Client',
                vendor: row.vendor_name || 'N/A',
                total: Number(row.total_amount || 0),
                items: items.map(i => ({
                    id: i.id,
                    name: i.item_name || 'Item',
                    qty: i.quantity,
                    price: Number(i.unit_price || 0),
                    total: Number(i.total_price || 0)
                }))
            });
        }
        return results;
    }

    static async getById(id) {
        const [rows] = await db.execute(
            `SELECT o.*, COALESCE(c.business_name, u.name) AS client_name, c.client_type, v.name AS vendor_name 
             FROM orders o 
             LEFT JOIN clients c ON o.company_id = c.id 
             LEFT JOIN users u ON o.client_id = u.id
             LEFT JOIN vendors v ON o.vendor_id = v.id
             WHERE o.id = ? AND o.deleted_at IS NULL`, [id]
        );
        if (!rows[0]) return null;
        const row = rows[0];

        const [items] = await db.execute(
            `SELECT oi.*, COALESCE(ii.name, oi.name) as item_name 
             FROM order_items oi 
             LEFT JOIN inventory_items ii ON oi.item_id = ii.id 
             WHERE oi.order_id = ?`, [id]
        );
        return {
            ...row,
            clientId: row.company_id || row.client_id,
            client: row.client_name || 'Individual Client',
            vendor: row.vendor_name || 'N/A',
            total: Number(row.total_amount || 0),
            items: items.map(i => ({
                id: i.id,
                name: i.item_name || 'Item',
                qty: i.quantity,
                price: Number(i.unit_price || 0),
                total: Number(i.total_price || 0)
            }))
        };
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows > 0;
    }

    static async update(id, updateData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const allowedFields = ['client_id', 'company_id', 'vendor_id', 'type', 'notes', 'total_amount', 'status', 'due_date', 'order_date'];
<<<<<<< HEAD

            // Map camelCase to snake_case if present
            const normalizedData = {
                ...updateData,
                client_id: updateData.clientId || updateData.client_id,
                company_id: updateData.companyId || updateData.company_id,
                vendor_id: updateData.vendorId || updateData.vendor_id,
                due_date: updateData.dueDate || updateData.due_date,
                order_date: updateData.orderDate || updateData.order_date || updateData.date,
                total_amount: updateData.total || updateData.totalAmount || updateData.total_amount
            };

=======
            
            // Map camelCase to snake_case if present
            const normalizedData = {
                ...updateData,
                client_id: updateData.clientId || updateData.client_id,
                company_id: updateData.companyId || updateData.company_id,
                vendor_id: updateData.vendorId || updateData.vendor_id,
                due_date: updateData.dueDate || updateData.due_date,
                order_date: updateData.orderDate || updateData.order_date || updateData.date,
                total_amount: updateData.total || updateData.totalAmount || updateData.total_amount
            };

>>>>>>> 881a753e8656230adba4f9372fb7ba0f10d4e325
            const data = Object.entries(normalizedData)
                .filter(([key, value]) => value !== undefined && allowedFields.includes(key))
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

            if (Object.keys(data).length > 0) {
                const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
                const values = [...Object.values(data), id];
                await connection.execute(`UPDATE orders SET ${fields} WHERE id = ?`, values);
            }

            // Handle Item Updates if passed: simpler to clear and re-insert given current schema
            if (updateData.items && Array.isArray(updateData.items)) {
                await connection.execute('DELETE FROM order_items WHERE order_id = ?', [id]);
                for (const item of updateData.items) {
                    const name = item.name || item.product || null;
                    const quantity = item.quantity || item.qty || 0;
                    const unit_price = item.unit_price || item.price || 0;
                    const totalPrice = quantity * unit_price;
<<<<<<< HEAD

=======
                    
>>>>>>> 881a753e8656230adba4f9372fb7ba0f10d4e325
                    await connection.execute(
                        'INSERT INTO order_items (order_id, item_id, name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?)',
                        [id, item.item_id || null, name, quantity, unit_price, totalPrice]
                    );
                }
            }

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
        const [result] = await db.execute('UPDATE orders SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        return this.softDelete(id);
    }
}

class Project {
    static async create(projectData) {
        const { name, description, manager_id, start_date, end_date, location, status, company_id, order_id } = projectData;
        const [result] = await db.execute(
            'INSERT INTO projects (name, description, manager_id, start_date, end_date, location, status, company_id, order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name || null, description || null, manager_id || null, start_date || null, end_date || null, location || null, status || 'planned', company_id || null, order_id || null]
        );
        return result.insertId;
    }

    static async createFromOrder(orderId, projectData) {
        const { name, description, manager_id, start_date, end_date, location } = projectData;

        // Get company_id from order
        const [orders] = await db.execute('SELECT company_id FROM orders WHERE id = ?', [orderId]);
        const company_id = orders[0] ? orders[0].company_id : null;

        const [result] = await db.execute(
            'INSERT INTO projects (order_id, company_id, name, description, manager_id, start_date, end_date, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [orderId, company_id || null, name || null, description || null, manager_id || null, start_date || null, end_date || null, location || null, 'planned']
        );

        // Update order status
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', ['project_converted', orderId]);

        return result.insertId;
    }

    static async getAllProjects(companyId) {
        let query = `
            SELECT p.*, COALESCE(c.business_name, 'Direct Project') AS client_name 
            FROM projects p
            LEFT JOIN clients c ON p.company_id = c.id
            WHERE p.deleted_at IS NULL
        `;
        const params = [];
        if (companyId) {
            query += ' AND p.company_id = ?';
            params.push(companyId);
        }
        query += ' ORDER BY p.created_at DESC';
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT p.*, u.name as manager_name, COALESCE(c.business_name, 'Direct Project') AS client_name 
            FROM projects p 
            LEFT JOIN users u ON p.manager_id = u.id 
            LEFT JOIN clients c ON p.company_id = c.id
            WHERE p.id = ?
        `, [id]);
        return rows[0];
    }

    static async update(id, updateData) {
        const allowedFields = ['name', 'description', 'manager_id', 'start_date', 'end_date', 'location', 'status', 'company_id', 'order_id'];
        const data = Object.entries(updateData)
            .filter(([key, value]) => value !== undefined && allowedFields.includes(key))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        if (Object.keys(data).length === 0) return true;

        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id];
        const [result] = await db.execute(`UPDATE projects SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    static async softDelete(id) {
        const [result] = await db.execute('UPDATE projects SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = { Order, Project };
