# DeafSo Backend API Guides

Welcome to the comprehensive API documentation for the DeafSo Backend system. This folder contains detailed guides for all API endpoints organized by functionality.

## 📚 Available Guides

### 1. [Authentication API Guide](./01_Authentication_API.md)
**Covers:** Student and Teacher authentication endpoints
- Student signup and login
- Teacher signup and login
- JWT token management
- Field validation rules
- Error handling

**Key Endpoints:**
- `POST /student/signup` - Student registration
- `POST /student/login` - Student authentication
- `POST /teacher/signup` - Teacher registration
- `POST /teacher/login` - Teacher authentication

### 2. [Student API Guide](./02_Student_API.md)
**Covers:** All student-related endpoints
- Student profile management
- Authorization and security

**Key Endpoints:**
- `GET /student/profile/:studentID` - Get student profile


## 🚀 Quick Start

### 1. Authentication
First, authenticate as a teacher or student:

```bash
# Teacher Login
curl -X POST http://localhost:3000/api/v1/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'
```

### 2. Use the Token
Include the JWT token in subsequent requests:

```bash
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Token Types
- **Student Token**: For student-specific endpoints
- **Teacher Token**: For teacher-specific endpoints

## 📋 API Overview

### Base URL
```
http://localhost:3000/api/v1
```

### Response Format
All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🛠️ Testing

### Postman Setup
1. Create environment variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `teacher_token`: `your_teacher_jwt_token`
   - `student_token`: `your_student_jwt_token`

### cURL Examples
Each guide includes comprehensive cURL examples for testing.

## 🔒 Security Features

### Authentication
- JWT token-based authentication
- Token expiration handling
- Secure session management

### Authorization
- Role-based access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📊 Database Schema

### Key Tables
- **students**: Student information
- **teachers**: Teacher information
- **student_sessions**: Student authentication sessions
- **teacher_sessions**: Teacher authentication sessions

## 🚨 Common Issues

### Authentication Issues
- **Problem**: "Invalid token" error
- **Solution**: Re-login to get fresh token

### Authorization Issues
- **Problem**: "Access denied" error
- **Solution**: Ensure proper user role and permissions

### Validation Errors
- **Problem**: Field validation fails
- **Solution**: Check field requirements and format

## 📞 Support

For additional support or questions:
1. Check the specific guide for your use case
2. Review the error handling sections
3. Test with the provided examples
4. Verify your authentication token

## 🔄 API Versioning

Current API Version: `v1`

All endpoints are prefixed with `/api/v1/`

## 📝 Contributing

When adding new endpoints or modifying existing ones:
1. Update the relevant guide
2. Add examples and error cases
3. Update this README if needed
4. Test all scenarios

---

**Last Updated:** January 2024
**API Version:** v1
**Base URL:** `http://localhost:3000/api/v1` 