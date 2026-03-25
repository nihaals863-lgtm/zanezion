const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'zanezion_db'
    });

    await conn.query(`
        CREATE TABLE IF NOT EXISTS client_menu_permissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_id INT NOT NULL,
            menu_id INT NOT NULL,
            can_view TINYINT(1) DEFAULT 0,
            can_add TINYINT(1) DEFAULT 0,
            can_edit TINYINT(1) DEFAULT 0,
            can_delete TINYINT(1) DEFAULT 0,
            UNIQUE KEY client_menu (client_id, menu_id),
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
            FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
        )
    `);
    console.log('client_menu_permissions table created');
    await conn.end();
    process.exit(0);
})();
