const db = require('../config/db');

class Invoice {
    static async create(data) {
        const { order_id, client_id, amount, due_date } = data;
        const [result] = await db.query(
            'INSERT INTO invoices (order_id, client_id, amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
            [order_id, client_id, amount, due_date, 'unpaid']
        );
        return result.insertId;
    }

    static async getAll(companyId) {
        let query = 'SELECT i.*, c.business_name as client_name, o.id as order_id FROM invoices i JOIN clients c ON i.client_id = c.id JOIN orders o ON i.order_id = o.id';
        const params = [];
        if (companyId) {
            query += ' WHERE c.id = ? OR o.company_id = ?';
            params.push(companyId, companyId);
        }
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT i.*, c.business_name as client_name, o.id as order_id FROM invoices i JOIN clients c ON i.client_id = c.id JOIN orders o ON i.order_id = o.id WHERE i.id = ?', [id]);
        return rows[0];
    }

    static async updateStatus(id, status) {
        await db.query('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        Object.keys(data).forEach(key => {
            if (['amount', 'status', 'due_date'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });
        values.push(id);
        await db.query(`UPDATE invoices SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    static async delete(id) {
        // Delete associated payments first to satisfy foreign key constraint
        await db.query('DELETE FROM payments WHERE invoice_id = ?', [id]);
        await db.query('DELETE FROM invoices WHERE id = ?', [id]);
    }
}

class Transaction {
    static async create(data) {
        const { invoice_id, amount, payment_method, transaction_id } = data;
        const [result] = await db.query(
            'INSERT INTO payments (invoice_id, amount, payment_method, transaction_id) VALUES (?, ?, ?, ?)',
            [invoice_id, amount, payment_method, transaction_id]
        );

        // Update invoice status if fully paid (simple check)
        const [invoice] = await db.query('SELECT amount FROM invoices WHERE id = ?', [invoice_id]);
        const [payments] = await db.query('SELECT SUM(amount) as total FROM payments WHERE invoice_id = ?', [invoice_id]);
        
        if (payments[0].total >= invoice[0].amount) {
            await db.query('UPDATE invoices SET status = ? WHERE id = ?', ['paid', invoice_id]);
        } else {
            await db.query('UPDATE invoices SET status = ? WHERE id = ?', ['partially_paid', invoice_id]);
        }

        return result.insertId;
    }
}

class Payroll {
    static async create(data) {
        const { 
            user_id, base_salary, bonus, 
            nib_deduction, medical_deduction, pension_deduction, 
            savings_deduction, birthday_club, net_amount, 
            payment_date, method 
        } = data;
        const [result] = await db.query(
            `INSERT INTO payroll (
                user_id, base_salary, bonus, 
                nib_deduction, medical_deduction, pension_deduction, 
                savings_deduction, birthday_club, net_amount, 
                amount, payment_date, status, method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, base_salary || 0, bonus || 0, 
                nib_deduction || 0, medical_deduction || 0, pension_deduction || 0, 
                savings_deduction || 0, birthday_club || 0, net_amount, 
                net_amount, payment_date || new Date().toISOString().split('T')[0], data.status || 'Pending', method || 'Direct Deposit'
            ]
        );
        return result.insertId;
    }

    static async getByUserId(userId) {
        const [rows] = await db.query('SELECT * FROM payroll WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }

    static async getAll(companyId) {
        let query = `
            SELECT p.*, u.name as user_name 
            FROM payroll p 
            JOIN users u ON p.user_id = u.id 
        `;
        const params = [];
        if (companyId) {
            query += ' WHERE u.company_id = ?';
            params.push(companyId);
        }
        query += ' ORDER BY p.created_at DESC';
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        const allowedFields = [
            'base_salary', 'bonus', 'nib_deduction', 'medical_deduction', 
            'pension_deduction', 'savings_deduction', 'birthday_club', 
            'net_amount', 'payment_date', 'status', 'method'
        ];

        Object.keys(data).forEach(key => {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                values.push(data[key]);
            }
        });

        if (fields.length === 0) return;

        values.push(id);
        await db.query(`UPDATE payroll SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    static async delete(id) {
        await db.query('DELETE FROM payroll WHERE id = ?', [id]);
    }
}

module.exports = { Invoice, Transaction, Payroll };
