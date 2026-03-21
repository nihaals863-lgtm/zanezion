const bcrypt = require('bcryptjs');

const password = '123456';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log(`Password: ${password}`);
console.log(`Hash: ${hash}`);

// Test the new hash
const match = bcrypt.compareSync(password, hash);
console.log(`Match: ${match}`);
