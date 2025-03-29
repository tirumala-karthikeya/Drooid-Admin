import { Request, Response } from 'express';
import sql from 'mssql';
import { pool } from '../config/db.config';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  weeklyPosts: number;
  activeReports: number;
  activeSessions: number;
  avgSessionTime: number;
}

interface DailyPost {
  date: string;
  postCount: number;
}

export const getStats = async (req: Request, res: Response) => {
  try {
    const request = pool.request();
    
    const query = `
      WITH DailyStats AS (
        SELECT 
          CAST(createdAt AS DATE) as date,
          COUNT(*) as postCount
        FROM dbo.posts
        WHERE createdAt >= DATEADD(day, -7, GETDATE())
        GROUP BY CAST(createdAt AS DATE)
      ),
      AllStats AS (
        SELECT 
          (SELECT COUNT(*) FROM dbo.posts) as totalPosts,
          (SELECT COUNT(*) FROM dbo.comments) as totalComments,
          (SELECT COUNT(*) FROM dbo.users) as totalUsers
      )
      SELECT 
        AllStats.*,
        ISNULL(SUM(DailyStats.postCount), 0) as weeklyPosts,
        (
          SELECT STRING_AGG(CONCAT(date, ':', postCount), ',')
          FROM DailyStats
        ) as dailyPostsData
      FROM AllStats
      LEFT JOIN DailyStats ON 1=1
      GROUP BY AllStats.totalPosts, AllStats.totalComments, AllStats.totalUsers;
    `;

    const result = await request.query(query);
    const stats = result.recordset[0];
    
    // Parse daily posts data into an array of objects
    const dailyPosts: DailyPost[] = stats.dailyPostsData ? 
      stats.dailyPostsData.split(',').map((day: string) => {
        const [date, count] = day.split(':');
        return { date, postCount: parseInt(count) };
      }).sort((a: DailyPost, b: DailyPost) => 
        new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];

    res.json({
      totalUsers: stats.totalUsers || 0,
      totalPosts: stats.totalPosts || 0,
      totalComments: stats.totalComments || 0,
      weeklyPosts: stats.weeklyPosts || 0,
      activeReports: 0,
      activeSessions: 0,
      avgSessionTime: 0,
      postsPerDay: dailyPosts
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard stats',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}; 