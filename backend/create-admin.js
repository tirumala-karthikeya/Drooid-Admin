const sql = require('mssql');
const bcrypt = require('bcryptjs');

const config = {
    server: 'sql-eus-drooid-stories-p1.database.windows.net',
    database: 'drooid-social',
    user: 'drooid-dev',
    password: 'Veritometrics@2020',
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

const adminUsers = [
    { email: 'admin1@example.com', name: 'Admin One', password: 'admin123' },
    { email: 'admin2@example.com', name: 'Admin Two', password: 'admin456' },
    { email: 'admin3@example.com', name: 'Admin Three', password: 'admin789' },
    { email: 'admin4@example.com', name: 'Admin Four', password: 'admin000' }
];

async function createAdminUsers() {
    let pool;
    try {
        // Create a new connection pool
        pool = await new sql.ConnectionPool(config).connect();
        console.log('Connected to database');

        // Create admin_users table instead of users
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='admin_users' and xtype='U')
            BEGIN
                CREATE TABLE admin_users (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    email NVARCHAR(255) NOT NULL UNIQUE,
                    password NVARCHAR(255) NOT NULL,
                    name NVARCHAR(255) NOT NULL,
                    created_at DATETIME DEFAULT GETDATE()
                )
            END
        `);

        for (const admin of adminUsers) {
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            
            await pool.request()
                .input('email', sql.NVarChar, admin.email)
                .input('password', sql.NVarChar, hashedPassword)
                .input('name', sql.NVarChar, admin.name)
                .query(`
                    IF NOT EXISTS (SELECT * FROM admin_users WHERE email = @email)
                    BEGIN
                        INSERT INTO admin_users (email, password, name)
                        VALUES (@email, @password, @name)
                    END
                `);
            
            console.log(`Admin user ${admin.email} created or already exists`);
        }

        console.log('All admin users processed');
    } catch (error) {
        console.error('Failed to create admin users:', error);
    } finally {
        if (pool) {
            await pool.close();
        }
        process.exit(0);
    }
}

createAdminUsers(); 