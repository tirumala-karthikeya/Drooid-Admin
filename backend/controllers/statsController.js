const sql = require('mssql');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const request = req.app.locals.pool.request();
    
    // First check if tables exist
    const validateQuery = `
      SELECT 
        OBJECT_ID('users') as usersExists,
        OBJECT_ID('posts') as postsExists,
        OBJECT_ID('comments') as commentsExists,
        OBJECT_ID('reports') as reportsExists,
        OBJECT_ID('sessions') as sessionsExists
    `;
    
    const validation = await request.query(validateQuery);
    const { usersExists, postsExists, commentsExists, reportsExists, sessionsExists } = validation.recordset[0];

    // Initialize stats with default values
    let stats = {
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      activeReports: 0,
      activeSessions: 0,
      avgSessionTime: 0,
      weeklyPosts: 0
    };

    // Get users count if table exists
    if (usersExists) {
      const usersResult = await request.query('SELECT COUNT(*) as count FROM users');
      stats.totalUsers = usersResult.recordset[0].count;
    }
    
    // Get posts count if table exists
    if (postsExists) {
      const postsResult = await request.query('SELECT COUNT(*) as count FROM posts');
      stats.totalPosts = postsResult.recordset[0].count;
      
      // Get weekly posts
      const weeklyPostsResult = await request.query(`
        SELECT COUNT(*) as count 
        FROM posts 
        WHERE createdAt >= DATEADD(day, -7, GETDATE())`);
      stats.weeklyPosts = weeklyPostsResult.recordset[0].count;
    }
    
    // Get comments count if table exists
    if (commentsExists) {
      const commentsResult = await request.query('SELECT COUNT(*) as count FROM comments');
      stats.totalComments = commentsResult.recordset[0].count;
    }

    // Get active reports count if table exists
    if (reportsExists) {
      const reportsResult = await request.query(`
        SELECT COUNT(*) as count 
        FROM reports 
        WHERE status = 'active'`);
      stats.activeReports = reportsResult.recordset[0].count;
    }

    // Get active sessions and average session time if table exists
    if (sessionsExists) {
      const sessionsResult = await request.query(`
        SELECT COUNT(*) as count 
        FROM sessions 
        WHERE lastActivity >= DATEADD(minute, -30, GETDATE())`);
      stats.activeSessions = sessionsResult.recordset[0].count;

      const avgSessionResult = await request.query(`
        SELECT AVG(DATEDIFF(minute, startTime, endTime)) as avgTime 
        FROM sessions 
        WHERE endTime IS NOT NULL 
        AND startTime >= DATEADD(day, -1, GETDATE())`);
      stats.avgSessionTime = Math.round(avgSessionResult.recordset[0].avgTime || 0);
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default values if there's an error
    res.json({
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      activeReports: 0,
      activeSessions: 0,
      avgSessionTime: 0,
      weeklyPosts: 0
    });
  }
};

module.exports = {
  getDashboardStats
}; 