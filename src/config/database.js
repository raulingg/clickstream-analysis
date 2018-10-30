const getDatabaseConfig = () => ({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  database: process.env.DB_DATABASE || 'analytics',
  debug: process.env.DB_DEBUG || false,
  waitForConnections: true,
  queueLimit: 0
})

export default getDatabaseConfig
