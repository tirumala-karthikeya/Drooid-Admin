const sql = require('mssql');

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const result = await req.app.locals.pool.request().query(`
      SELECT 
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
      FROM comments c
      INNER JOIN posts p ON c.postId = p.id
      INNER JOIN users u ON c.userId = u.id
      ORDER BY c.createdAt DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  
  try {
    const request = req.app.locals.pool.request().input('id', sql.Int, id);
    
    // Delete related records in a single transaction
    await request.query(`
      BEGIN TRANSACTION;
        DELETE FROM commentreactions WHERE commentId = @id;
        DELETE FROM comments WHERE id = @id;
      COMMIT;
    `);
    
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllComments,
  deleteComment
}; 