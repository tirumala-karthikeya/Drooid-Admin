import { Request, Response } from 'express';
import { pool, poolConnect } from '../config/db.config';
import sql from 'mssql';

export const getComments = async (req: Request, res: Response) => {
  try {
    // Ensure database connection is established
    await poolConnect;
    
    // Validate database connection
    if (!pool.connected) {
      throw new Error('Database connection not established');
    }

    const request = pool.request();
    
    // First check if tables exist
    const validateQuery = `
      SELECT 
        OBJECT_ID('dbo.comments') as commentsExists,
        OBJECT_ID('dbo.users') as usersExists
    `;
    
    const validation = await request.query(validateQuery);
    const { commentsExists, usersExists } = validation.recordset[0];

    if (!commentsExists || !usersExists) {
      throw new Error(`Required tables missing: ${!commentsExists ? 'comments ' : ''}${!usersExists ? 'users' : ''}`);
    }

    const query = `
      SELECT TOP 100
        c.id, 
        c.userId,
        c.postId,
        c.replyCount,
        c.parentId,
        c.content,
        c.createdAt,
        c.updatedAt,
        c.isFlagged,
        p.title as postTitle,
        u.name as authorName
      FROM dbo.comments c
      INNER JOIN dbo.posts p ON c.postId = p.id
      INNER JOIN dbo.users u ON c.userId = u.id
      ORDER BY c.createdAt DESC
    `;

    console.log('Executing comments query...');
    const result = await request.query(query);
    console.log(`Found ${result.recordset.length} comments`);
    
    if (!result.recordset) {
      throw new Error('No recordset returned from query');
    }
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error in getComments:', err);
    console.error('Stack trace:', err instanceof Error ? err.stack : '');
    res.status(500).json({ 
      error: 'Failed to fetch comments',
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : '') : undefined
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Ensure database connection is established
    await poolConnect;
    
    // Validate database connection
    if (!pool.connected) {
      throw new Error('Database connection not established');
    }

    const request = pool.request()
      .input('id', sql.Int, parseInt(id));
    
    // Delete related records in a single transaction
    await request.query(`
      BEGIN TRANSACTION;
        DELETE FROM dbo.commentreactions WHERE commentId = @id;
        DELETE FROM dbo.comments WHERE id = @id;
      COMMIT;
    `);
    
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    console.error('Stack trace:', err instanceof Error ? err.stack : '');
    res.status(500).json({ 
      error: 'Failed to delete comment',
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : '') : undefined
    });
  }
}; 