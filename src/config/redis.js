const {createClient} =require( 'redis')

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-18618.c9.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 18618
    }
});



module.exports = redisClient;