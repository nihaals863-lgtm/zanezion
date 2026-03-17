const SubscriptionRequest = require('./models/saasModel');

async function testModel() {
    try {
        console.log('Testing saasModel.getAll()...');
        const requests = await SubscriptionRequest.getAll();
        console.log('Success! Found %d requests.', requests.length);
        process.exit(0);
    } catch (error) {
        console.error('Model Error:', error);
        console.error('Error Code:', error.code);
        process.exit(1);
    }
}

testModel();
