const pool = require('./config/db');

async function checkExactName() {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        const names = rows.map(r => Object.values(r)[0]);
        console.log('Exact Table Names:');
        names.forEach(name => {
            console.log(`'${name}' (Length: ${name.length})`);
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkExactName();
