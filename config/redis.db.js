const redis = require("redis");

const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379 
});

client.on('connect', () => {
    console.log('Redis serverga muvaffaqiyatli ulanildi');
});

client.on('error', (err) => {
    console.error('Redis xatosi:', err);
});

module.exports = client;
