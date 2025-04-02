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

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { q, field } = req.query;
    const searchQuery = q;
    const searchField = field;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const request = req.app.locals.pool.request();
    
    let query = `
      SELECT DISTINCT TOP 100
        p.id,
        p.title,
        p.content,
        p.regionofInterest,
        p.imageUrl,
        p.viewsCount,
        p.commentsCount,
        p.createdAt,
        p.updatedAt,
        p.topic,
        p.subTopic,
        p.trendScore,
        p.tagline,
        p.isFlagged,
        p.storyDate,
        p.decayed_trend_score
      FROM posts p
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
          query += ` AND p.topic LIKE @searchTopic`;
          break;
        case 'subTopic':
          request.input('searchSubTopic', sql.NVarChar, `%${searchQuery}%`);
          query += ` AND p.subTopic LIKE @searchSubTopic`;
          break;
        default:
          request.input('searchAll', sql.NVarChar, `%${searchQuery}%`);
          query += ` AND (
            p.title LIKE @searchAll
            OR p.topic LIKE @searchAll
            OR p.subTopic LIKE @searchAll
          )`;
      }
    } else {
      request.input('searchAll', sql.NVarChar, `%${searchQuery}%`);
      query += ` AND (
        p.title LIKE @searchAll
        OR p.topic LIKE @searchAll
        OR p.subTopic LIKE @searchAll
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
  deletePost,
  searchPosts
}; 