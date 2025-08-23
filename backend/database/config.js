// require("dotenv").config();
// /**
//  * Configuration to establish a database connection
//  */
// const config = {
//     db:{
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         port: process.env.DB_PORT,
//         password: process.env.DB_PASS,
//         database: process.env.DB_NAME,
//         connectionLimit: 10,
//     }
// }
// module.exports = config;











require("dotenv").config();
/**
 * Configuration to establish a PostgreSQL database connection
 */
const config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT || 5432,  // Default PostgreSQL port is 5432
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        max: 10,  // connection pool max size
        idleTimeoutMillis: 30000,  // Connection timeout
        connectionTimeoutMillis: 2000,  // Time until the connection times out
    }
}
module.exports = config;