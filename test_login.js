const db = require('./config/db');
const User = require('./models/userModel');

async function testLogin() {
    try {
        const email = 'admin@zanezion.com';
        const password = '123456';
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('User not found');
            return;
        }
        console.log('User found:', user.email);
        const match = await User.comparePassword(password, user.password);
        console.log('Password match:', match);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testLogin();
