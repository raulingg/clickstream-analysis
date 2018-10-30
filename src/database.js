import mysql from 'mysql2/promise'

export default { init: configs => mysql.createPool(configs) }
