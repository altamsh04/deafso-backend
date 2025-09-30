const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const teacherRoutes = require('./routes/teachersRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', dashboardRoutes);
app.use('/api/v1/teacher', teacherRoutes);
app.use('/api/v1/subject', subjectRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DeafSo Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server after database connection test
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 DeafSo Backend API is ready!`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📖 API Documentation:`);
      console.log(`   - Student Auth: POST /api/v1/student/signup, POST /api/v1/student/login`);
      console.log(`   - Teacher Auth: POST /api/v1/teacher/signup, POST /api/v1/teacher/login`);
      console.log(`   - Student Profile: GET /api/v1/student/profile/:studentID`);
      console.log(`   - Subject Management: POST /api/v1/subject/add-subject, POST /api/v1/subject/chat`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app; 