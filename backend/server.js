const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { pool } = require('./config/db.config');
const appConfig = require('./config/app.config');

const app = express();
const PORT = appConfig.port;

// Middleware
app.use(cors(appConfig.cors));
app.use(bodyParser.json());
app.use(cookieParser());

// Make pool available to routes
app.locals.pool = pool;

// Import routes
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});