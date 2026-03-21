const bcrypt = require('bcryptjs');

const users = [
    { name: 'Super Admin', email: 'admin@zanezion.com', hash: '$2b$10$69bt5Yn/motv.7i19/6tU.H9OrHQ9sKefghjXLBdbpzxbbR.pVBGS' },
    { name: 'Concierge Manager', email: 'demo1@example.com', hash: '$2b$10$KvClv84DpwJpDO9TPiMq6.DAM3hZMW0Gj5SSSto5lFZkrc1n2ZxDO' },
    { name: 'Operations Lead', email: 'opertion@example.com', hash: '$2b$10$0fOeRBzeddnRsi/g/.6z6uSvlIXKfxzjCMneIVCfca8VI.TC9owem' },
    { name: 'Logistics Lead', email: 'logistic@example.com', hash: '$2b$10$eOMPfqNzJGJxKwpLTT3sOO3fqr2BPXy5NGBCF1i10CUfwdMhOCFFq' },
    { name: 'Field Staff Alpha', email: 'staff@example.com', hash: '$2b$10$Q/etFD1AKCP58XFbg3nqoes88g5w2NMlLtJ5UdS8IhjsRADh.TOVS' },
    { name: 'Procurement Officer', email: 'procurement@example.com', hash: '$2b$10$Mi1juJzxqr8VJ.ShB9RB2OfGjkGwF5Ew/ju3d6/aZ10TV9jKtZhgi' },
    { name: 'Inventory Manager', email: 'inventroy@example.com', hash: '$2b$10$v9wj.qnvtkm7/b4HUwhACu8B3npjnefuD/q.Nzg8AXGp8/4H5Xa2K' },
    { name: 'Enterprise Client', email: 'client11@exampel.com', hash: '$2b$10$.WzmrMM9.FU.opU3Nsvt4uMMx7G73dVQViyONLMBKnCuGnAoFdo22' }
];

const password = '123456';

async function testAll() {
    for (const user of users) {
        const match = await bcrypt.compare(password, user.hash);
        console.log(`${user.name} (${user.email}): ${match ? 'MATCH' : 'FAIL'}`);
    }
}

testAll();
