import io from 'ioredis'

const dragonfly = new io('redis://:gq9ildlB3fuWF5yzZJEWm4Ok55cd7IfGpb9alzk2likAzwTr50SRweR3hkcu3ctd@159.69.14.23:4394/0')

dragonfly.on('connect', () => {
    console.log('Connected to dragonfly ✅')
})

dragonfly.on('error', (err) => {
    console.log('Dragonfly error ❌', err)
})

dragonfly.on('ready', () => {
    console.log('Dragonfly is ready ✅')
})

// String operations
await dragonfly.set('user:1', 'John Doe')
const user1 = await dragonfly.get('user:1')
console.log('Get user:1:', user1)

// Numbers
await dragonfly.incr('visitors')
const visitors = await dragonfly.get('visitors')
console.log('Visitors count:', visitors)

await dragonfly.incrby('points', 50)
const points = await dragonfly.get('points')
console.log('Points total:', points)

// Lists
await dragonfly.lpush('queue:tasks', 'task1')
await dragonfly.rpush('queue:tasks', 'task2')
const tasks = await dragonfly.lrange('queue:tasks', 0, -1)
console.log('All tasks:', tasks)

const poppedTask = await dragonfly.lpop('queue:tasks')
console.log('Popped task:', poppedTask)

// Sets
await dragonfly.sadd('tags', 'javascript', 'typescript', 'redis')
const allTags = await dragonfly.smembers('tags')
console.log('All tags:', allTags)

const hasJavascript = await dragonfly.sismember('tags', 'javascript')
console.log('Has javascript tag:', hasJavascript)

// Hashes (objects)
await dragonfly.hset('user:2', 'name', 'Jane', 'age', '25', 'city', 'NYC')
const userName = await dragonfly.hget('user:2', 'name')
console.log('User 2 name:', userName)

const userDetails = await dragonfly.hgetall('user:2')
console.log('All user 2 details:', userDetails)

// Sorted Sets
await dragonfly.zadd('leaderboard', 100, 'player1')
await dragonfly.zadd('leaderboard', 200, 'player2')
const leaderboard = await dragonfly.zrange('leaderboard', 0, -1, 'WITHSCORES')
console.log('Leaderboard with scores:', leaderboard)

const player1Rank = await dragonfly.zrank('leaderboard', 'player1')
console.log('Player1 rank:', player1Rank)

// Key operations
const userExists = await dragonfly.exists('user:1')
console.log('User:1 exists:', userExists)

const sessionTTL = await dragonfly.ttl('session:123')
console.log('Session TTL:', sessionTTL)

// Multiple operations
await dragonfly.mset({
    'key1': 'value1',
    'key2': 'value2',
    'key3': 'value3'
})
const multipleValues = await dragonfly.mget(['key1', 'key2', 'key3'])
console.log('Multiple values:', multipleValues)

// Pattern matching
const userKeys = await dragonfly.keys('user:*')
console.log('All user keys:', userKeys)

// Bitfields for compact numeric arrays
await dragonfly.setbit('online:users', 1234, 1) // Set user 1234 as online
const isOnline = await dragonfly.getbit('online:users', 1234)
console.log('Is user 1234 online:', isOnline)

// Geospatial operations
await dragonfly.geoadd('locations', -122.27, 37.80, 'berkeley')
await dragonfly.geoadd('locations', -122.41, 37.77, 'san_francisco')
const distance = await dragonfly.geodist('locations', 'berkeley', 'san_francisco')
console.log('Distance between Berkeley and SF:', distance, 'km')

// HyperLogLog for cardinality estimation
await dragonfly.pfadd('unique:visitors', 'user1', 'user2', 'user3')
await dragonfly.pfadd('unique:visitors', 'user3', 'user4') // user3 won't be counted twice
const uniqueCount = await dragonfly.pfcount('unique:visitors')
console.log('Approximate unique visitors:', uniqueCount)

// Pub/Sub (requires separate subscribers)
await dragonfly.publish('news', 'Breaking news!')
console.log('Message published to news channel')

// Transaction (MULTI/EXEC)
const multi = dragonfly.multi()
multi.set('key1', 'val1')
multi.set('key2', 'val2')
multi.get('key1')
multi.get('key2')
const results = await multi.exec()
console.log('Transaction results:', results)

// Scanning large datasets
let cursor = '0'
const scanResults = []
do {
    const [nextCursor, keys] = await dragonfly.scan(cursor, 'MATCH', 'user:*', 'COUNT', '10')
    cursor = nextCursor
    scanResults.push(...keys)
} while (cursor !== '0')
console.log('Scanned keys:', scanResults)

// Lists with blocking operations
await dragonfly.rpush('job:queue', 'job1', 'job2')
const job = await dragonfly.blpop('job:queue', 5) // Wait up to 5 seconds
console.log('Received job:', job)

// Hash operations with multiple fields
await dragonfly.hmset('product:1', {
    name: 'Laptop',
    price: '999.99',
    stock: '50',
    category: 'Electronics'
})
const productFields = await dragonfly.hmget('product:1', 'price')
console.log('Product details:', productFields)

// Sets with multiple operations
await dragonfly.sadd('set1', '1', '2', '3', '4')
await dragonfly.sadd('set2', '3', '4', '5', '6')
const intersection = await dragonfly.sinter('set1', 'set2')
console.log('Common elements:', intersection)
const difference = await dragonfly.sdiff('set1', 'set2')
console.log('Elements only in set1:', difference)

// String operations with patterns
await dragonfly.mset({
    'cache:user:1': 'data1',
    'cache:user:2': 'data2',
    'cache:post:1': 'post1'
})
const cacheKeys = await dragonfly.keys('cache:user:*')
console.log('User cache keys:', cacheKeys)

// Sorted set with ranks and scores
await dragonfly.zadd('highscores', 1000, 'player1', 2000, 'player2', 1500, 'player3')
const playerRanks = await dragonfly.zrevrange('highscores', 0, -1, 'WITHSCORES')
console.log('Player rankings:', playerRanks)

// List operations with ranges
await dragonfly.rpush('recent:logs', 'log1', 'log2', 'log3', 'log4', 'log5')
const recentLogs = await dragonfly.lrange('recent:logs', -3, -1) // Last 3 logs
console.log('Recent logs:', recentLogs)

// Expiring keys with timestamps
const futureTimestamp = Math.floor(Date.now() / 1000) + 3600
await dragonfly.set('temp:key', 'value')
await dragonfly.expireat('temp:key', futureTimestamp)
const remainingTime = await dragonfly.ttl('temp:key')
console.log('Remaining time:', remainingTime)

process.exit(0)