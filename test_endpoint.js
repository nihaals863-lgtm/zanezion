const http = require('http');

function postRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: body }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function getRequest(options) {
    return new Promise((resolve, reject) => {
        const req = http.get(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: body }));
        });
        req.on('error', reject);
    });
}

async function testEndpoint() {
    try {
        console.log('Testing POST /api/saas/requests/submit...');
        const postRes = await postRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/saas/requests/submit',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            clientName: 'Test Client',
            plan: 'Platinum Protocol',
            contact: 'Test Contact',
            email: 'test@example.com'
        });
        console.log('Post Status:', postRes.status);
        console.log('Post Data:', postRes.data);

        console.log('Testing GET /api/saas/requests...');
        const getRes = await getRequest({
            hostname: 'localhost',
            port: 5000,
            path: '/api/saas/requests'
        });
        console.log('Get Status:', getRes.status);
        console.log('Get Data:', getRes.data);
        process.exit(0);
    } catch (error) {
        console.error('Test Error:', error.message);
        process.exit(1);
    }
}

testEndpoint();
