# Student API Guide

## Overview
This guide covers all student-related endpoints in the DeafSo Backend API.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All student endpoints require authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <student_jwt_token>
```

## Student Endpoints

### 1. Get Student Profile
**Endpoint:** `GET /student/profile/:studentID`

Retrieve a student's profile information.

**Headers:**
```
Authorization: Bearer <student_jwt_token>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student profile retrieved successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john.doe@student.com",
    "mobile": "9876543210",
    "standard": "10",
    "division": "A",
    "rollnumber": "10A001",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Student not found"
}
```


## Field Validation Rules

### Student ID Parameter
| Field | Type | Required | Format | Description |
|-------|------|----------|--------|-------------|
| studentID | integer | ✅ | Positive integer | Student's unique ID |

### Standard and Division Parameters
| Field | Type | Required | Format | Values |
|-------|------|----------|--------|--------|
| standard | string | ✅ | String | "1" through "12" |
| division | string | ✅ | String | 1-5 characters |

## Error Responses

### Authentication Errors (401 Unauthorized)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

### Authorization Errors (403 Forbidden)
```json
{
  "success": false,
  "message": "Access denied. You can only view your own profile."
}
```

### Validation Errors (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "studentID",
      "message": "Student ID must be a positive integer"
    }
  ]
}
```

### Server Errors (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Postman Testing

### Environment Setup
1. Create environment variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `student_token`: `your_student_jwt_token`
   - `student_id`: `1`

### Test Requests

#### Get Student Profile
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/1 \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Get Student Subjects
```bash
curl -X GET http://localhost:3000/api/v1/student/subjects/10/A \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json"
```

### Postman Collection Example

#### 1. Get Student Profile
**Request:**
- Method: `GET`
- URL: `{{base_url}}/student/profile/{{student_id}}`
- Headers: 
  - `Authorization: Bearer {{student_token}}`
  - `Content-Type: application/json`

#### 2. Get Student Subjects
**Request:**
- Method: `GET`
- URL: `{{base_url}}/student/subjects/10/A`
- Headers: 
  - `Authorization: Bearer {{student_token}}`
  - `Content-Type: application/json`

## Security Features

### Authorization
- Students can only view their own profile
- Students can view subjects for any standard/division
- JWT token validation for all requests

### Data Protection
- Sensitive data filtered in responses
- Input validation and sanitization
- SQL injection prevention

## Best Practices

### For Development
1. Test with different student IDs
2. Verify authorization rules
3. Test with invalid tokens
4. Check error handling

### For Production
1. Implement rate limiting
2. Add request logging
3. Set up monitoring
4. Use HTTPS for all requests

## Common Issues

### Authorization Issues
- **Problem**: "Access denied" error
- **Solution**: Ensure student is viewing their own profile

### Token Issues
- **Problem**: "Invalid token" error
- **Solution**: Re-login to get fresh token

### Data Not Found
- **Problem**: "Student not found" error
- **Solution**: Check if student ID exists

## Example Workflow

### Step 1: Student Login
```bash
curl -X POST http://localhost:3000/api/v1/student/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@student.com",
    "password": "password123"
  }'
```

### Step 2: Extract Token
Copy the token from the login response and set it as an environment variable.

### Step 3: Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/student/profile/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Get Subjects
```bash
curl -X GET http://localhost:3000/api/v1/student/subjects/10/A \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Scenarios

### Valid Scenarios
1. ✅ Student views own profile
2. ✅ Student views subjects for their standard
3. ✅ Student views subjects for other standards

### Invalid Scenarios
1. ❌ Student views another student's profile
2. ❌ Request without authentication
3. ❌ Request with invalid token
4. ❌ Request with expired token

## Response Format

All successful responses follow this format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
``` 