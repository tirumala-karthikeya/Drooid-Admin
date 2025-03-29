const sql = require('mssql');

// Get all posts with search functionality
const getAllPosts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT TOP 100
        id, 
        title, 
        content, 
        regionofInterest,
        imageUrl,
        viewsCount,
        commentsCount,
        categories,
        createdAt,
        updatedAt,
        topic,
        subTopic,
        trendScore,
        tagline,
        isFlagged,
        storyDate,
        decayed_trend_score
      FROM posts
    `;

    // Add search condition if search parameter is provided
    if (search) {
      query += ` WHERE title LIKE @search`;
    }

    // Add ordering and pagination
    query += ` ORDER BY createdAt DESC OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    const request = req.app.locals.pool.request()
      .input('offset', sql.Int, offset)
      .input('limit', sql.Int, parseInt(limit));

    if (search) {
      request.input('search', sql.NVarChar, `%${search}%`);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;
  
  try {
    const request = req.app.locals.pool.request().input('id', sql.Int, id);
    
    // Delete related records in a single transaction
    await request.query(`
      BEGIN TRANSACTION;
        DELETE FROM comments WHERE postId = @id;
        DELETE FROM reports WHERE postId = @id;
        DELETE FROM posts WHERE id = @id;
      COMMIT;
    `);
    
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPosts,
  deletePost
}; 