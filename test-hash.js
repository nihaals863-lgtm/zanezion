const bcrypt = require('bcryptjs');

const password = '123456';
const hash = '$2b$10$.WzmrMM9.FU.opU3Nsvt4uMMx7G73dVQViyONLMBKnCuGnAoFdo22';

bcrypt.compare(password, hash).then(result => {
    console.log('Match:', result);
}).catch(err => {
    console.error('Error:', err);
});
