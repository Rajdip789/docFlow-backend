const Redis = require("ioredis");

const pubClient = new Redis(process.env.REDIS_URL);
const subClient = new Redis(process.env.REDIS_URL);

module.exports = { pubClient, subClient };