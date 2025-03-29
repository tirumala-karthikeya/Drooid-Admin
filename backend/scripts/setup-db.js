const sql = require('mssql');
const bcrypt = require('bcryptjs');

const dbConfig = {
  server: 'sql-eus-drooid-stories-p1.database.windows.net',
  user: 'drooid-dev',
  password: 'Veritometrics@2020',
  database: 'drooid-social',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function setupDatabase() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connected to database');

    // Create users table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        name NVARCHAR(255),
        role NVARCHAR(50) DEFAULT 'user',
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      )
    `);
    console.log('Users table created or already exists');

    // Check if admin user exists
    const result = await pool.request()
      .input('email', sql.NVarChar, 'admin@example.com')
      .query('SELECT * FROM users WHERE email = @email');

    if (result.recordset.length === 0) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Insert admin user
      await pool.request()
        .input('email', sql.NVarChar, 'admin@example.com')
        .input('password', sql.NVarChar, hashedPassword)
        .input('name', sql.NVarChar, 'Admin User')
        .input('role', sql.NVarChar, 'admin')
        .query(`
          INSERT INTO users (email, password, name, role)
          VALUES (@email, @password, @name, @role)
        `);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database setup completed');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase(); 