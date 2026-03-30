const db = require('../config/db');

class Vehicle {
    static async getAll(company_id = null) {
        let query = 'SELECT * FROM vehicles';
        const params = [];
        if (company_id !== undefined && company_id !== null) {
            query += ' WHERE company_id = ?';
            params.push(company_id);
        }
        const [rows] = await db.query(query, params);
        return rows;
    }

    static async create(data) {
        const { plate_number, model, type, fuel_level, vehicle_type, capacity, insurance_policy, registration_expiry, inspection_date, diagnostic_status, companyId, company_id } = data;
        const cid = companyId || company_id || null;
        const [result] = await db.query(
            'INSERT INTO vehicles (plate_number, model, type, fuel_level, vehicle_type, status, capacity, insurance_policy, registration_expiry, inspection_date, diagnostic_status, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [
                plate_number, 
                model, 
                type, 
                fuel_level || 100, 
                vehicle_type || 'Truck', 
                'available', 
                capacity || null, 
                insurance_policy || null, 
                registration_expiry || null, 
                inspection_date || null, 
                diagnostic_status || 'Healthy',
                cid
            ]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { plate_number, model, type, fuel_level, vehicle_type, status, capacity, insurance_policy, registration_expiry, inspection_date, diagnostic_status } = data;
        const [result] = await db.query(
            'UPDATE vehicles SET plate_number = ?, model = ?, type = ?, fuel_level = ?, vehicle_type = ?, status = ?, capacity = ?, insurance_policy = ?, registration_expiry = ?, inspection_date = ?, diagnostic_status = ? WHERE id = ?',
            [
                plate_number || null, 
                model || null, 
                type || null, 
                fuel_level || 100, 
                vehicle_type || 'Truck', 
                status || 'available', 
                capacity || null, 
                insurance_policy || null, 
                registration_expiry || null, 
                inspection_date || null, 
                diagnostic_status || 'Healthy', 
                id
            ]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM vehicles WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async updateStatus(id, status) {
        await db.query('UPDATE vehicles SET status = ? WHERE id = ?', [status, id]);
    }
}

class Delivery {
    static async create(data) {
        const { 
            project_id, order_id, vehicle_id, driver_id, route_id, 
            mission_type, passenger_info, package_details, destination_type, 
            customs_clearance, route, custom_route, items 
        } = data;
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const [result] = await connection.query(
                `INSERT INTO deliveries (
                    project_id, order_id, vehicle_id, driver_id, route_id, 
                    mission_type, passenger_info, package_details, destination_type, 
                    customs_clearance, route, custom_route, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    project_id || null, order_id || null, vehicle_id || null, driver_id || null, route_id || null,
                    mission_type || 'Logistics', 
                    passenger_info ? JSON.stringify(passenger_info) : null,
                    package_details ? JSON.stringify(package_details) : null,
                    destination_type || 'Domestic',
                    customs_clearance || false,
                    route || null,
                    custom_route || null,
                    'Pending'
                ]
            );
            
            const deliveryId = result.insertId;
            
            // Insert multi-assets if provided
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await connection.query(
                        'INSERT INTO delivery_items (delivery_id, name, qty, weight, length, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        [deliveryId, item.name, item.qty || 1, item.weight, item.length, item.width, item.height]
                    );
                }
            }

            // Mark vehicle as on mission
            if (vehicle_id) {
                await connection.query('UPDATE vehicles SET status = ? WHERE id = ?', ['on_mission', vehicle_id]);
            }

            await connection.commit();
            return deliveryId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAll(company_id = null, pagination = {}) {
        const { limit, offset } = pagination;
        let query = 'SELECT d.*, v.plate_number, u.name as driver_name, r.name as route_name FROM deliveries d LEFT JOIN vehicles v ON d.vehicle_id = v.id LEFT JOIN users u ON d.driver_id = u.id LEFT JOIN routes r ON d.route_id = r.id';
        const params = [];
        if (company_id !== undefined && company_id !== null) {
            query = 'SELECT d.*, v.plate_number, u.name as driver_name, r.name as route_name FROM deliveries d JOIN orders o ON d.order_id = o.id LEFT JOIN vehicles v ON d.vehicle_id = v.id LEFT JOIN users u ON d.driver_id = u.id LEFT JOIN routes r ON d.route_id = r.id WHERE o.company_id = ?';
            params.push(company_id);
        }

        const [rows] = await db.query(query + ' ORDER BY d.created_at DESC', params);
        return { rows, total: rows.length };
    }

    static async getById(id, company_id = null) {
        let query = 'SELECT d.*, v.plate_number, u.name as driver_name, r.name as route_name FROM deliveries d LEFT JOIN vehicles v ON d.vehicle_id = v.id LEFT JOIN users u ON d.driver_id = u.id LEFT JOIN routes r ON d.route_id = r.id WHERE d.id = ?';
        const params = [id];
        if (company_id !== undefined && company_id !== null) {
            query = 'SELECT d.*, v.plate_number, u.name as driver_name, r.name as route_name FROM deliveries d JOIN orders o ON d.order_id = o.id LEFT JOIN vehicles v ON d.vehicle_id = v.id LEFT JOIN users u ON d.driver_id = u.id LEFT JOIN routes r ON d.route_id = r.id WHERE d.id = ? AND o.company_id = ?';
            params.push(company_id);
        }
        const [rows] = await db.query(query, params);
        return rows[0];
    }

    static async updateStatus(id, status, proofData = {}) {
        const { signature, photo, pod } = proofData;
        const [result] = await db.query(
            'UPDATE deliveries SET status = ?, proof_of_delivery_signature = ?, proof_of_delivery_photo = ?, pod = ?, delivery_date = CASE WHEN ? IN ("delivered", "Delivered", "Completed") THEN CURRENT_TIMESTAMP ELSE delivery_date END WHERE id = ?',
            [status, signature || null, photo || null, pod ? JSON.stringify(pod) : null, status, id]
        );

        // If delivered/completed, free the vehicle
        if (['delivered', 'Delivered', 'Completed'].includes(status)) {
            const [deliveryRows] = await db.query('SELECT vehicle_id FROM deliveries WHERE id = ?', [id]);
            if (deliveryRows[0] && deliveryRows[0].vehicle_id) {
                await db.query('UPDATE vehicles SET status = ? WHERE id = ?', ['available', deliveryRows[0].vehicle_id]);
            }
        }

        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [deliveryRows] = await db.query('SELECT vehicle_id FROM deliveries WHERE id = ?', [id]);
        const vehicleId = deliveryRows[0]?.vehicle_id;

        // delivery_items table may not exist in older schemas
        try {
            await db.query('DELETE FROM delivery_items WHERE delivery_id = ?', [id]);
        } catch (e) {
            console.log('delivery_items cleanup skipped:', e.message);
        }

        const [result] = await db.query('DELETE FROM deliveries WHERE id = ?', [id]);

        if (vehicleId) {
            await db.query('UPDATE vehicles SET status = ? WHERE id = ?', ['available', vehicleId]);
        }
        return result.affectedRows > 0;
    }
}

class Route {
    static async getAll() {
        let query = 'SELECT * FROM routes';
        const [rows] = await db.query(query);
        return rows;
    }

    static async create(data) {
        const { name, start_location, end_location, distance_km, estimated_time } = data;
        const [result] = await db.query(
            'INSERT INTO routes (name, start_location, end_location, distance_km, estimated_time) VALUES (?, ?, ?, ?, ?)',
            [name, start_location || null, end_location || null, distance_km || 0, estimated_time || null]
        );
        return result.insertId;
    }
    static async update(id, data) {
        const { name, start_location, end_location, distance_km, estimated_time } = data;
        const [result] = await db.query(
            'UPDATE routes SET name = ?, start_location = ?, end_location = ?, distance_km = ?, estimated_time = ? WHERE id = ?',
            [name, start_location || null, end_location || null, distance_km || 0, estimated_time || null, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM routes WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

class DeliveryPricing {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM delivery_pricing ORDER BY min_distance ASC');
        return rows;
    }

    static async update(id, price) {
        const [result] = await db.query(
            'UPDATE delivery_pricing SET price = ? WHERE id = ?',
            [price, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = { Vehicle, Delivery, Route, DeliveryPricing };
