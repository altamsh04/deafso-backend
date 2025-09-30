# DeafSo Backend

A comprehensive REST API for the DeafSo educational platform with JWT authentication, PostgreSQL database, and Prisma ORM for type-safe database operations.

## 🚀 Features

- **JWT Authentication** for secure user sessions with database token validation
- **Prisma ORM** with PostgreSQL database and type-safe queries
- **Input Validation** using express-validator with comprehensive error messages
- **Error Handling** middleware for consistent API responses
- **Security** with helmet, CORS, and bcrypt password hashing
- **RESTful API** following industry best practices
- **Database Migrations** with Prisma for schema version control
- **Comprehensive Testing** with automated API test suite

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher) or **Supabase** cloud database
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deafso-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the sample environment file
   cp env.sample .env
   ```
   
   Then edit `.env` and update the values:
   - `DATABASE_URL`: Your PostgreSQL connection string (Supabase recommended)
   - `JWT_SECRET`: Generate a strong secret key (32+ characters)
   - `CORS_ORIGIN`: Your frontend URL(s)

4. **Database Setup**
   ```bash
   # Initialize database schema and generate Prisma client
   npm run db:init
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### 🔐 Authentication Routes

#### Student Authentication

**Student Signup**
- **POST** `/api/v1/student/signup`
- **Description**: Register a new student account
- **Body:**
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "password123",
    "standard": "10",
    "division": "A",
    "rollnumber": "10A001"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Student registered successfully",
    "data": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "standard": "10",
      "division": "A",
      "rollnumber": "10A001"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

**Student Login**
- **POST** `/api/v1/student/login`
- **Description**: Authenticate existing student
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as signup with user data and JWT token

#### Teacher Authentication

**Teacher Signup**
- **POST** `/api/v1/teacher/signup`
- **Description**: Register a new teacher account
- **Body:**
  ```json
  {
    "fullname": "Jane Smith",
    "email": "jane@example.com",
    "mobile": "9876543211",
    "password": "password123"
  }
  ```
- **Response:** User data and JWT token

**Teacher Login**
- **POST** `/api/v1/teacher/login`
- **Description**: Authenticate existing teacher
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response:** User data and JWT token

### 📊 Dashboard Routes

#### Student Dashboard

**Get Student Profile**
- **GET** `/api/v1/student/profile/:studentID`
- **Description**: Retrieve student profile information
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Student profile retrieved successfully",
    "data": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "standard": "10",
      "division": "A",
      "rollnumber": "10A001",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
  ```


#### Teacher Dashboard

**Get Teacher Profile**
- **GET** `/api/v1/teacher/profile/:teacherID`
- **Description**: Retrieve teacher profile information
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Teacher profile retrieved successfully",
    "data": {
      "id": 1,
      "fullname": "Jane Smith",
      "email": "jane@example.com",
      "mobile": "9876543211",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 🔍 Additional Routes

**Get Students in Class**
- **GET** `/api/v1/class/:standard/:division/students`
- **Description**: Get all students in a specific class
- **Response:** List of students with basic information


**Logout**
- **POST** `/api/v1/student/logout` or `/api/v1/teacher/logout`
- **Description**: Invalidate JWT token and logout user
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

## 🗄️ Database Schema

The application uses **Prisma ORM** with PostgreSQL and the following models:

### 📋 Database Models

- **Student** - Student information and authentication
- **Teacher** - Teacher information and authentication  
- **Subject** - Subject information with teacher relationships
- **StudentSession** - JWT token management for students
- **TeacherSession** - JWT token management for teachers

### 🔧 Key Features:
- **Type-safe queries** with Prisma Client
- **Automatic relations** between models
- **Database migrations** for schema changes
- **Prisma Studio** for database visualization
- **Session management** for secure authentication
- **PostgreSQL-specific optimizations** with proper indexes and constraints

### 📊 Database Relationships:
```
Student (1) ←→ (Many) StudentSession
Teacher (1) ←→ (Many) TeacherSession
Teacher (1) ←→ (Many) Subject
Subject (Many) ←→ (1) Teacher
```

## 🔒 Security Features

- **JWT Token Authentication** with database validation and token expiration
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** and sanitization using express-validator
- **CORS Protection** with configurable origins
- **Helmet Security Headers** for enhanced security
- **SQL Injection Prevention** using Prisma's parameterized queries
- **Rate Limiting** protection (configurable)
- **Request Logging** with Morgan for monitoring

## 🧪 Testing

### Automated Testing
```bash
# Run the complete test suite
npm test
```

### Manual Testing with curl

```bash
# Health check
curl http://localhost:3000/health

# Student signup
curl -X POST http://localhost:3000/api/v1/student/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test Student",
    "email": "test@example.com",
    "mobile": "9876543210",
    "password": "password123",
    "standard": "10",
    "division": "A",
    "rollnumber": "10A002"
  }'

# Student login
curl -X POST http://localhost:3000/api/v1/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get student profile (with token)
curl -X GET http://localhost:3000/api/v1/student/profile/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

```

### Testing with Postman
1. Import the API endpoints into Postman
2. Set up environment variables for base URL and tokens
3. Use the provided request examples above

## 📁 Project Structure

```
deafso-backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── dashboardController.js # Dashboard operations
├── database/
│   ├── postgres_schema.sql  # PostgreSQL schema
│   └── README.md           # Database documentation
├── lib/
│   └── prisma.js           # Prisma client configuration
├── middleware/
│   ├── authMiddleware.js   # JWT authentication
│   ├── errorMiddleware.js  # Error handling
│   └── validationMiddleware.js # Input validation
├── prisma/
│   ├── schema.prisma       # Prisma schema
│   └── seed.js             # Database seeding
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   └── dashboardRoutes.js  # Dashboard routes
├── server.js               # Main application file
├── test-api.js             # API testing suite
├── package.json            # Dependencies and scripts
├── env.sample              # Environment variables template
└── README.md              # This file
```

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   DATABASE_URL="your_production_postgresql_url"
   JWT_SECRET="your_production_jwt_secret"
   CORS_ORIGIN="https://yourdomain.com"
   ```

2. **Database Setup**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed production data (if needed)
   npm run db:seed
   ```

3. **Process Management with PM2**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start the application
   pm2 start server.js --name deafso-backend
   
   # Monitor the application
   pm2 monit
   
   # View logs
   pm2 logs deafso-backend
   ```

## 🛠️ Development Tools

### Database Management
- **Prisma Studio**: Visual database browser
  ```bash
  npm run db:studio
  ```
- **Database Migrations**: Schema version control
  ```bash
  npm run db:migrate
  ```

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run API test suite
npm run db:init    # Initialize database schema
npm run db:seed    # Seed database with sample data
npm run db:studio  # Open Prisma Studio
npm run db:migrate # Run database migrations
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and ensure code quality
4. **Add tests** for new functionality
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description

### Development Guidelines
- Follow the existing code style
- Add proper error handling
- Include input validation
- Write meaningful commit messages
- Test your changes thoroughly

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `DATABASE_URL` format
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **JWT Token Issues**
   - Check `JWT_SECRET` is set correctly
   - Verify token expiration settings
   - Ensure proper Authorization header format

3. **CORS Errors**
   - Update `CORS_ORIGIN` in your `.env` file
   - Check frontend URL configuration

4. **Prisma Errors**
   - Run `npx prisma generate` to regenerate client
   - Check schema syntax in `prisma/schema.prisma`
   - Verify database migrations

### Getting Help
- Check the [database documentation](./database/README.md)
- Review the [Prisma documentation](https://www.prisma.io/docs/)
- Open an issue with detailed error information

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database powered by [Prisma](https://www.prisma.io/) and [PostgreSQL](https://www.postgresql.org/)
- Authentication using [JWT](https://jwt.io/)
- Security enhanced with [Helmet](https://helmetjs.github.io/)
