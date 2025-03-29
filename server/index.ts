import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import routes from './routes';
import { poolConnect } from './config/db.config';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', routes);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Stack trace:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

app.use(errorHandler);

// Wait for database connection before starting server
poolConnect.then(() => {
  console.log('Database connection established');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database:', err);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});