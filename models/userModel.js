const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const {
            name, email, phone, password, role,
            status, employment_status, is_salaried, vacation_balance,
            bank_name, account_number, routing_number, payment_method, nib_number, birthday,
            has_passport, has_license, has_nib_doc, has_police_record,
            has_resume, has_profile_pic, has_certs, is_available,
            passport_url, license_url, nib_document_url, police_record_url, profile_pic_url
        } = userData;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = password ? await bcrypt.hash(password, salt) : await bcrypt.hash('Password123!', salt);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // If a soft-deleted user exists with same email, clean it up first
            const [deletedUser] = await connection.query(
                'SELECT id FROM users WHERE email = ? AND deleted_at IS NOT NULL', [email]
            );
            if (deletedUser.length > 0) {
                const oldId = deletedUser[0].id;
                // Remove related records so FK constraints don't block
                await connection.query('DELETE FROM staff_details WHERE user_id = ?', [oldId]);
                await connection.query('DELETE FROM clients WHERE user_id = ?', [oldId]);
                await connection.query('UPDATE events SET manager_id = NULL WHERE manager_id = ?', [oldId]);
                await connection.query('UPDATE orders SET client_id = NULL WHERE client_id = ?', [oldId]);
                await connection.query('DELETE FROM users WHERE id = ?', [oldId]);
            }

            // 1. Create User (Core Auth)
            const [userResult] = await connection.query(
                `INSERT INTO users (name, email, phone, password, role, status, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, email, phone || null, hashedPassword, role || 'operations', status || 'Active', userData.company_id || null]
            );
            const userId = userResult.insertId;

            // 2. Create Staff Details (if role is not Client/Vendor)
            if (!['Client', 'Vendor'].includes(role)) {
                await connection.query(
                    `INSERT INTO staff_details (
                        user_id, employment_status, is_salaried, vacation_balance, 
                        bank_name, account_number, routing_number, payment_method, nib_number, birthday,
                        has_passport, has_license, has_nib_doc, has_police_record,
                        has_resume, has_profile_pic, has_certs, is_available,
                        passport_url, license_url, nib_document_url, police_record_url, profile_pic_url
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        userId, employment_status || 'Full Time', is_salaried ?? true, vacation_balance || 0,
                        bank_name || null, account_number || null, routing_number || null, payment_method || null,
                        nib_number || null, birthday || null,
                        has_passport || false, has_license || false, has_nib_doc || false, has_police_record || false,
                        has_resume || false, has_profile_pic || false, has_certs || false, is_available ?? true,
                        passport_url || null, license_url || null, nib_document_url || null, police_record_url || null, profile_pic_url || null
                    ]
                );
            }

            await connection.commit();
            return userId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByEmail(email) {
        const [rows] = await db.query(`
            SELECT u.*, sd.*, u.id as id 
            FROM users u 
            LEFT JOIN staff_details sd ON u.id = sd.user_id 
            WHERE u.email = ? AND u.deleted_at IS NULL
        `, [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query(`
            SELECT u.*, sd.*, u.id as id 
            FROM users u 
            LEFT JOIN staff_details sd ON u.id = sd.user_id 
            WHERE u.id = ? AND u.deleted_at IS NULL
        `, [id]);
        return rows[0];
    }

    static async findAll(companyId, pagination = {}) {
        const { limit, offset, search, status, role } = pagination;

        let query = `
            SELECT u.id, u.name, u.email, u.phone, u.role, u.status, u.company_id, u.avatar_url, u.created_at,
                   sd.employment_status, sd.is_salaried, sd.vacation_balance,
                   sd.bank_name, sd.account_number, sd.routing_number, sd.payment_method as pay_method,
                   sd.nib_number, sd.birthday,
                   sd.has_passport, sd.has_license, sd.has_nib_doc, sd.has_resume, sd.has_profile_pic,
                   sd.is_available
            FROM users u
            LEFT JOIN staff_details sd ON u.id = sd.user_id
            WHERE u.deleted_at IS NULL AND u.role NOT IN ('Vendor', 'SaaS Client', 'saas_client')
        `;
        const params = [];

        if (companyId !== undefined) {
            if (companyId === null) {
                // Superadmin Global View
            } else {
                query += ' AND u.company_id = ?';
                params.push(companyId);
            }
        }

        if (status) {
            query += ' AND u.status = ?';
            params.push(status);
        }

        if (role) {
            query += ' AND u.role = ?';
            params.push(role);
        }

        if (search) {
            query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern);
        }

        const [rows] = await db.query(query + ' ORDER BY u.created_at DESC', params);
        return { rows, total: rows.length };
    }

    static async getOperationsAdmins() {
        const [rows] = await db.query(`
            SELECT id, name 
            FROM users 
            WHERE role = 'operations' AND status = 'Active' AND deleted_at IS NULL
        `);
        return rows;
    }

    static async comparePassword(enteredPassword, hashedPassword) {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    }

    static async update(id, updateData) {
        const userFields = ['name', 'email', 'phone', 'role', 'status', 'password', 'avatar_url'];
        const staffFields = [
            'employment_status', 'is_salaried', 'vacation_balance', 'bank_name',
            'account_number', 'routing_number', 'payment_method', 'nib_number', 'birthday',
            'has_passport', 'has_license', 'has_nib_doc', 'has_police_record',
            'has_resume', 'has_profile_pic', 'has_certs', 'is_available',
            'passport_url', 'license_url', 'nib_document_url', 'police_record_url', 'profile_pic_url'
        ];

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Manually check email uniqueness if email is being updated
            if (updateData.email) {
                const [existing] = await connection.query(
                    'SELECT id FROM users WHERE email = ? AND id != ? AND deleted_at IS NULL',
                    [updateData.email, id]
                );
                if (existing.length > 0) {
                    const error = new Error(`Email '${updateData.email}' is already in use by another active account.`);
                    error.statusCode = 400;
                    throw error;
                }
            }

            const userData = {};
            const staffData = {};

            // 2. Sanitize password update (only hash if provided and not empty)
            if (updateData.password && updateData.password.trim() !== '') {
                const salt = await bcrypt.genSalt(10);
                userData.password = await bcrypt.hash(updateData.password, salt);
            }

            Object.keys(updateData).forEach(key => {
                if (userFields.includes(key) && key !== 'password') userData[key] = updateData[key];
                if (staffFields.includes(key)) staffData[key] = updateData[key];
            });

            if (Object.keys(userData).length > 0) {
                const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
                await connection.query(`UPDATE users SET ${fields} WHERE id = ?`, [...Object.values(userData), id]);
            }

            if (Object.keys(staffData).length > 0) {
                const fields = Object.keys(staffData).map(key => `${key} = ?`).join(', ');
                await connection.query(`UPDATE staff_details SET ${fields} WHERE user_id = ?`, [...Object.values(staffData), id]);
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
        const [result] = await db.query('UPDATE users SET deleted_at = CURRENT_TIMESTAMP, status = "inactive" WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = User;
