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

async function initializeDatabase() {
    let pool;
    try {
        // Create a new connection pool
        pool = await new sql.ConnectionPool(config).connect();
        console.log('Connected to database');

        // Drop existing users table if it exists (since we need to add the role column)
        await pool.request().query(`
            IF EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
            BEGIN
                DROP TABLE users
            END
        `);
        console.log('Dropped existing users table');

        // Create users table with role column
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' and xtype='U')
            BEGIN
                CREATE TABLE users (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    email NVARCHAR(255) NOT NULL UNIQUE,
                    password NVARCHAR(255) NOT NULL,
                    name NVARCHAR(255) NOT NULL,
                    role NVARCHAR(50) DEFAULT 'user',
                    created_at DATETIME DEFAULT GETDATE(),
                    updated_at DATETIME DEFAULT GETDATE()
                )
            END
        `);
        console.log('Users table created with role column');

        // Create posts table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='posts' and xtype='U')
            BEGIN
                CREATE TABLE posts (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    title NVARCHAR(MAX) NOT NULL,
                    content NVARCHAR(MAX),
                    userId INT FOREIGN KEY REFERENCES users(id),
                    regionofInterest NVARCHAR(255),
                    imageUrl NVARCHAR(MAX),
                    viewsCount INT DEFAULT 0,
                    commentsCount INT DEFAULT 0,
                    topic NVARCHAR(255),
                    subTopic NVARCHAR(255),
                    trendScore FLOAT DEFAULT 0,
                    tagline NVARCHAR(MAX),
                    isFlagged BIT DEFAULT 0,
                    storyDate DATETIME,
                    decayed_trend_score FLOAT DEFAULT 0,
                    created_at DATETIME DEFAULT GETDATE(),
                    updated_at DATETIME DEFAULT GETDATE()
                )
            END
        `);
        console.log('Posts table created or already exists');

        // Create comments table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='comments' and xtype='U')
            BEGIN
                CREATE TABLE comments (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    content NVARCHAR(MAX) NOT NULL,
                    userId INT FOREIGN KEY REFERENCES users(id),
                    postId INT FOREIGN KEY REFERENCES posts(id),
                    parentId INT,
                    replyCount INT DEFAULT 0,
                    isFlagged BIT DEFAULT 0,
                    created_at DATETIME DEFAULT GETDATE(),
                    updated_at DATETIME DEFAULT GETDATE()
                )
            END
        `);
        console.log('Comments table created or already exists');

        // Create reports table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='reports' and xtype='U')
            BEGIN
                CREATE TABLE reports (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    type NVARCHAR(50) NOT NULL,
                    status NVARCHAR(50) DEFAULT 'active',
                    userId INT FOREIGN KEY REFERENCES users(id),
                    postId INT FOREIGN KEY REFERENCES posts(id),
                    commentId INT FOREIGN KEY REFERENCES comments(id),
                    reason NVARCHAR(MAX),
                    created_at DATETIME DEFAULT GETDATE(),
                    updated_at DATETIME DEFAULT GETDATE()
                )
            END
        `);
        console.log('Reports table created or already exists');

        // Create sessions table
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sessions' and xtype='U')
            BEGIN
                CREATE TABLE sessions (
                    id INT PRIMARY KEY IDENTITY(1,1),
                    userId INT FOREIGN KEY REFERENCES users(id),
                    startTime DATETIME DEFAULT GETDATE(),
                    endTime DATETIME,
                    lastActivity DATETIME DEFAULT GETDATE()
                )
            END
        `);
        console.log('Sessions table created or already exists');

        // Create test admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        await pool.request()
            .input('email', sql.NVarChar, 'admin@example.com')
            .input('password', sql.NVarChar, adminPassword)
            .input('name', sql.NVarChar, 'Admin User')
            .input('role', sql.NVarChar, 'admin')
            .query(`
                IF NOT EXISTS (SELECT * FROM users WHERE email = @email)
                BEGIN
                    INSERT INTO users (email, password, name, role)
                    VALUES (@email, @password, @name, @role)
                END
            `);
        console.log('Test admin user created or already exists');

        // Create some sample data
        const sampleUser = await pool.request()
            .input('email', sql.NVarChar, 'user@example.com')
            .input('password', sql.NVarChar, await bcrypt.hash('user123', 10))
            .input('name', sql.NVarChar, 'Sample User')
            .input('role', sql.NVarChar, 'user')
            .query(`
                IF NOT EXISTS (SELECT * FROM users WHERE email = @email)
                BEGIN
                    INSERT INTO users (email, password, name, role)
                    OUTPUT INSERTED.id
                    VALUES (@email, @password, @name, @role)
                END
                ELSE
                BEGIN
                    SELECT id FROM users WHERE email = @email
                END
            `);
        
        const userId = sampleUser.recordset[0].id;

        // Create sample posts
        for(let i = 1; i <= 5; i++) {
            await pool.request()
                .input('title', sql.NVarChar, `Sample Post ${i}`)
                .input('content', sql.NVarChar, `This is the content of sample post ${i}`)
                .input('userId', sql.Int, userId)
                .input('topic', sql.NVarChar, `Topic ${i}`)
                .query(`
                    INSERT INTO posts (title, content, userId, topic)
                    VALUES (@title, @content, @userId, @topic)
                `);
        }
        console.log('Sample posts created');

        // Create sample comments
        const posts = await pool.request().query('SELECT id FROM posts');
        for(const post of posts.recordset) {
            await pool.request()
                .input('content', sql.NVarChar, `Sample comment on post ${post.id}`)
                .input('userId', sql.Int, userId)
                .input('postId', sql.Int, post.id)
                .query(`
                    INSERT INTO comments (content, userId, postId)
                    VALUES (@content, @userId, @postId)
                `);
        }
        console.log('Sample comments created');

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    } finally {
        if (pool) {
            await pool.close();
        }
        process.exit(0);
    }
}

initializeDatabase(); 