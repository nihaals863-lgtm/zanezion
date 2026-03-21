const User = require('./models/userModel');
async function run() {
    try {
        const staff = await User.findAll();
        console.log('Staff list (sample):', staff.slice(0, 3));
        const user15 = staff.find(u => u.id === 15);
        console.log('User 15 in findAll:', user15);
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}
run();
