const sql = require('mssql');

// Database configuration
const dbConfig = {
  server: 'sql-eus-drooid-stories-p1.database.windows.net',
  user: 'drooid-dev',
  password: 'Veritometrics@2020',
  database: 'drooid-social',
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  port: 1433
};

// Create a connection pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

// Test database connection
poolConnect.then(() => {
  console.log('Database connection successful');
}).catch(err => {
  console.error('Database connection failed:', err);
});

module.exports = {
  server: 'sql-eus-drooid-stories-p1.database.windows.net',
  user: 'drooid-dev',
  password: 'Veritometrics@2020',
  database: 'drooid-social',
  options: {
    encrypt: true,
    trustServerCertificate: false
  },
  pool,
  poolConnect
}; 