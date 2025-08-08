# Authentication API Guide

## Overview
This guide covers all authentication endpoints for students and teachers in the DeafSo Backend API.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication Flow

### 1. Student Authentication

#### Student Signup
**Endpoint:** `POST /student/signup`

**Request Body:**
```json
{
  "fullname": "John Doe",
  "email": "john.doe@student.com",
  "mobile": "9876543210",
  "password": "password123",
  "standard": "10",
  "division": "A",
  "rollnumber": "10A001"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john.doe@student.com",
      "mobile": "9876543210",
      "standard": "10",
      "division": "A",
      "rollnumber": "10A001"
    }
  }
}
```

#### Student Login
**Endpoint:** `POST /student/login`

**Request Body:**
```json
{
  "email": "john.doe@student.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john.doe@student.com",
      "mobile": "9876543210",
      "standard": "10",
      "division": "A",
      "rollnumber": "10A001"
    }
  }
}
```

### 2. Teacher Authentication

#### Teacher Signup
**Endpoint:** `POST /teacher/signup`

**Request Body:**
```json
{
  "fullname": "Jane Smith",
  "email": "jane.smith@teacher.com",
  "mobile": "9876543211",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Teacher registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "teacher": {
      "id": 1,
      "fullname": "Jane Smith",
      "email": "jane.smith@teacher.com",
      "mobile": "9876543211"
    }
  }
}
```

#### Teacher Login
**Endpoint:** `POST /teacher/login`

**Request Body:**
```json
{
  "email": "jane.smith@teacher.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Teacher logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "teacher": {
      "id": 1,
      "fullname": "Jane Smith",
      "email": "jane.smith@teacher.com",
      "mobile": "9876543211"
    }
  }
}
```

## Field Validation Rules

### Student Fields
| Field | Type | Required | Min Length | Max Length | Format/Values |
|-------|------|----------|------------|------------|---------------|
| fullname | string | ✅ | 2 | 255 | Any text |
| email | string | ✅ | - | - | Valid email format |
| mobile | string | ✅ | 10 | 10 | 10 digits only |
| password | string | ✅ | 6 | - | Any text |
| standard | string | ✅ | - | - | "1" through "12" |
| division | string | ✅ | 1 | 5 | Any text |
| rollnumber | string | ✅ | 1 | 20 | Unique per student |

### Teacher Fields
| Field | Type | Required | Min Length | Max Length | Format/Values |
|-------|------|----------|------------|------------|---------------|
| fullname | string | ✅ | 2 | 255 | Any text |
| email | string | ✅ | - | - | Valid email format |
| mobile | string | ✅ | 10 | 10 | 10 digits only |
| password | string | ✅ | 6 | - | Any text |

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "mobile",
      "message": "Mobile number must be 10 digits"
    }
  ]
}
```

### Duplicate Email Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### Invalid Credentials (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Using JWT Tokens

### Token Structure
JWT tokens contain:
- **Student Token**: `studentId`, `email`, `iat`, `exp`
- **Teacher Token**: `teacherId`, `email`, `iat`, `exp`

### Token Usage
Include the token in the Authorization header for protected endpoints:
```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Tokens expire after 24 hours
- Refresh by logging in again
- Expired tokens return 401 Unauthorized

## Postman Testing

### Environment Setup
1. Create environment variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `student_token`: `your_student_jwt_token`
   - `teacher_token`: `your_teacher_jwt_token`

### Test Requests

#### Student Signup
```bash
curl -X POST http://localhost:3000/api/v1/student/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Alice Johnson",
    "email": "alice@student.com",
    "mobile": "9876543220",
    "password": "password123",
    "standard": "11",
    "division": "B",
    "rollnumber": "11B001"
  }'
```

#### Teacher Login
```bash
curl -X POST http://localhost:3000/api/v1/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'
```

## Security Features

### Password Security
- Passwords are hashed using bcrypt
- Minimum 6 characters required
- Stored securely in database

### Session Management
- JWT tokens stored in database
- Automatic session cleanup
- Secure token validation

### Input Validation
- Comprehensive field validation
- SQL injection prevention
- XSS protection

## Best Practices

### For Development
1. Use environment variables for sensitive data
2. Test with different user roles
3. Validate all error scenarios
4. Check token expiration handling

### For Production
1. Use HTTPS for all requests
2. Implement rate limiting
3. Add password complexity requirements
4. Set up proper logging
5. Use secure session management

## Common Issues

### Token Issues
- **Problem**: "Invalid token" error
- **Solution**: Re-login to get fresh token

### Validation Errors
- **Problem**: Field validation fails
- **Solution**: Check field requirements and format

### Duplicate Email
- **Problem**: Email already exists
- **Solution**: Use different email or login with existing account 