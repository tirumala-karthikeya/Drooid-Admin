import { Request, Response } from 'express';
import sql from 'mssql';
import { pool, poolConnect } from '../config/db.config';

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q, field } = req.query;
    const searchQuery = q as string;
    const searchField = field as string;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const request = pool.request();
    
    let query = `
      SELECT DISTINCT TOP 100
        p.id,
        p.title,
        p.regionofInterest,
        p.imageUrl,
        p.viewsCount,
        p.commentsCount,
        p.createdAt,
        p.updatedAt,
        i.name as topic,
        si.name as subTopic,
        p.trendScore,
        p.tagline,
        p.isFlagged,
        p.storyDate,
        p.decayed_trend_score
      FROM dbo.posts p
      LEFT JOIN dbo.interests i ON p.topic = i.id
      LEFT JOIN dbo.subinterests si ON p.subTopic = si.id
      WHERE 1=1
    `;

    if (searchField === 'id') {
      const postId = parseInt(searchQuery);
      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }
      request.input('searchId', sql.Int, postId);
      query += ` AND p.id = @searchId`;
    } else if (searchField && searchField !== 'all') {
      switch (searchField) {
        case 'title':
          request.input('searchTitle', sql.NVarChar, `%${searchQuery}%`);
          query += ` AND p.title LIKE @searchTitle`;
          break;
        case 'topic':
          request.input('searchTopic', sql.NVarChar, `%${searchQuery}%`);
          query += ` AND i.name LIKE @searchTopic`;
          break;
        case 'subTopic':
          request.input('searchSubTopic', sql.NVarChar, `%${searchQuery}%`);
          query += ` AND si.name LIKE @searchSubTopic`;
          break;
        default:
          request.input('searchAll', sql.NVarChar, `%${searchQuery}%`);
          query += ` AND (
            p.title LIKE @searchAll
            OR i.name LIKE @searchAll
            OR si.name LIKE @searchAll
          )`;
      }
    } else {
      request.input('searchAll', sql.NVarChar, `%${searchQuery}%`);
      query += ` AND (
        p.title LIKE @searchAll
        OR i.name LIKE @searchAll
        OR si.name LIKE @searchAll
      )`;
    }

    query += ` ORDER BY p.createdAt DESC`;

    console.log('Executing query:', query);
    console.log('Search parameters:', { searchQuery, searchField });
    
    const result = await request.query(query);
    console.log(`Found ${result.recordset.length} results`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error searching posts:', err);
    res.status(500).json({ 
      error: 'Failed to search posts',
      message: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const request = pool.request();
    
    // First check if the post exists
    const checkResult = await request
      .input('id', sql.Int, id)
      .query('SELECT id FROM dbo.posts WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete related records in a single transaction
    try {
      await request.query(`
        BEGIN TRANSACTION;
          -- Delete news images first
          DELETE FROM dbo.news_images WHERE postId = @id;
          
          -- Delete comments
          DELETE FROM dbo.comments WHERE postId = @id;
          
          -- Finally delete the post
          DELETE FROM dbo.posts WHERE id = @id;
        COMMIT;
      `);
      
      res.json({ success: true, message: 'Post deleted successfully' });
    } catch (transactionError) {
      console.error('Transaction error:', transactionError);
      // Rollback the transaction if it failed
      await request.query('IF @@TRANCOUNT > 0 ROLLBACK;');
      throw transactionError;
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    // Check if it's a foreign key constraint error
    if (err instanceof Error && err.message.includes('FK_')) {
      return res.status(400).json({ 
        error: 'Cannot delete post due to existing relationships',
        message: 'This post has related records that must be deleted first'
      });
    }
    res.status(500).json({ 
      error: 'Failed to delete post',
      message: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}; 