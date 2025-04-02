module.exports = {
  port: process.env.PORT || 3001,
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
}; 