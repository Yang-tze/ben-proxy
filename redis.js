const redis = require("redis");

const client = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1"
});

client.on("error", err => {
  console.log(err);
});

module.exports = client;
