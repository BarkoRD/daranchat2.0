const {createPool} = require('mysql2/promise');

// const pool = createPool({
//     host: 'localhost',
//     user: 'daranhu1_mother',
//     password: '8496509366Aa',
//     database: 'daranhu1_app'
// })

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'users'
})


module.exports = pool