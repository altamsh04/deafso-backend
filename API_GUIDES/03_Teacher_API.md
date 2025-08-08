# Teacher API Guide

## Overview
This guide covers all teacher-related endpoints in the DeafSo Backend API, including subject management.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All teacher endpoints require authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <teacher_jwt_token>
```

## Understanding teacherId

**Important**: You do NOT need to pass `teacherId` in the request body. The `teacherId` is automatically extracted from the JWT token when the teacher is authenticated.

### How teacherId Works:
1. **Authentication**: When a teacher logs in, they receive a JWT token
2. **Token Decoding**: The token contains the teacher's ID
3. **Automatic Extraction**: The `authenticateTeacher` middleware automatically extracts the teacher's ID from the token
4. **Request Object**: The teacher's ID is available as `req.teacher.id` in the controller
5. **Database Association**: Subjects are automatically associated with the authenticated teacher

### Example Flow:
```
1. Teacher Login → Get JWT Token
2. Include Token in Request Header → Authorization: Bearer <token>
3. Middleware Decodes Token → Extracts teacherId
4. Controller Uses teacherId → req.teacher.id
5. Subject Created → Associated with teacher automatically
```

## Teacher Subject Management Endpoints

### 1. Add New Subject
**Endpoint:** `POST /teacher/subjects`

Add a new subject to the database. Only authenticated teachers can add subjects.

#### Demo Request Bodies

**Example 1: Mathematics Subject**
```json
{
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A",
  "duration": 60,
  "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry. Topics covered: Quadratic equations, coordinate geometry, trigonometry, statistics, and probability."
}
```

**Example 2: Physics Subject**
```json
{
  "subjectName": "Physics",
  "standard": "12",
  "division": "B",
  "duration": 75,
  "content": "Advanced physics concepts including mechanics, thermodynamics, electromagnetism, and modern physics. Practical experiments and problem-solving exercises included."
}
```

**Example 3: English Literature**
```json
{
  "subjectName": "English Literature",
  "standard": "11",
  "division": "C",
  "duration": 45,
  "content": "Study of classic and contemporary literature. Reading comprehension, essay writing, poetry analysis, and creative writing skills development."
}
```

**Example 4: Computer Science**
```json
{
  "subjectName": "Computer Science",
  "standard": "9",
  "division": "A",
  "duration": 90,
  "content": "Introduction to programming concepts, algorithms, data structures, and software development. Hands-on coding projects and problem-solving exercises."
}
```

**Example 5: Chemistry (Minimal Content)**
```json
{
  "subjectName": "Chemistry",
  "standard": "8",
  "division": "B",
  "duration": 50
}
```

**Example 6: History (Long Content)**
```json
{
  "subjectName": "History",
  "standard": "7",
  "division": "A",
  "duration": 40,
  "content": "Comprehensive study of world history from ancient civilizations to modern times. Topics include: Ancient Egypt, Greek and Roman civilizations, Medieval period, Renaissance, Industrial Revolution, World Wars, and contemporary history. Students will develop critical thinking skills through analysis of historical events, primary sources, and cultural developments."
}
```

#### Required vs Optional Fields

**Required Fields:**
- `subjectName` (string, 2-100 characters)
- `standard` (string, must be "1" through "12")
- `division` (string, 1-5 characters)

**Optional Fields:**
- `duration` (integer, default: 0, min: 0)
- `content` (string, max: 10000 characters, default: null)

**Note**: `teacherId` is NOT required in the request body - it's automatically extracted from the JWT token.

#### Validation Rules

| Field | Type | Required | Min Length | Max Length | Format/Values | Source |
|-------|------|----------|------------|------------|---------------|--------|
| subjectName | string | ✅ | 2 | 100 | Any text | Request Body |
| standard | string | ✅ | - | - | "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" | Request Body |
| division | string | ✅ | 1 | 5 | Any text | Request Body |
| duration | integer | ❌ | - | - | Non-negative integer | Request Body |
| content | string | ❌ | - | 10000 | Any text | Request Body |
| teacherId | integer | ✅ | - | - | Positive integer | JWT Token (Auto) |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Subject added successfully",
  "data": {
    "id": 1,
    "subjectName": "Mathematics",
    "standard": "10",
    "division": "A",
    "duration": 60,
    "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry.",
    "teacher": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john.doe@school.com"
    }
  }
}
```

### 2. Get All Teacher's Subjects
**Endpoint:** `GET /teacher/subjects`

Retrieve all subjects created by the authenticated teacher.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subjects retrieved successfully",
  "data": [
    {
      "id": 1,
      "subjectName": "Mathematics",
      "standard": "10",
      "division": "A",
      "duration": 60,
      "content": "Advanced mathematics concepts...",
      "views": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "teacher": {
        "id": 1,
        "fullname": "John Doe",
        "email": "john.doe@school.com"
      }
    }
  ]
}
```

### 3. Get Subject by ID
**Endpoint:** `GET /teacher/subjects/:subjectId`

Retrieve a specific subject by ID. Only the teacher who created the subject can access it.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subject retrieved successfully",
  "data": {
    "id": 1,
    "subjectName": "Mathematics",
    "standard": "10",
    "division": "A",
    "duration": 60,
    "content": "Advanced mathematics concepts...",
    "views": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "teacher": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john.doe@school.com"
    }
  }
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "Subject not found"
}
```

### 4. Update Subject
**Endpoint:** `PUT /teacher/subjects/:subjectId`

Update an existing subject. Only the teacher who created the subject can update it.

**Request Body (all fields optional):**
```json
{
  "subjectName": "Advanced Mathematics",
  "standard": "11",
  "division": "B",
  "duration": 90,
  "content": "Updated content with more advanced topics."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subject updated successfully",
  "data": {
    "id": 1,
    "subjectName": "Advanced Mathematics",
    "standard": "11",
    "division": "B",
    "duration": 90,
    "content": "Updated content with more advanced topics.",
    "views": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z",
    "teacher": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john.doe@school.com"
    }
  }
}
```

### 5. Delete Subject
**Endpoint:** `DELETE /teacher/subjects/:subjectId`

Delete a subject. Only the teacher who created the subject can delete it.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

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

### Validation Errors (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "subjectName",
      "message": "Subject name must be between 2 and 100 characters"
    },
    {
      "field": "standard",
      "message": "Standard must be between 1 and 12"
    }
  ]
}
```

### Duplicate Subject Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Subject already exists for this standard and division"
}
```

### Authorization Errors (403 Forbidden)
```json
{
  "success": false,
  "message": "Access denied. You can only modify your own subjects."
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
   - `teacher_token`: `your_teacher_jwt_token`
   - `subject_id`: `1`

### Test Requests

#### Add New Subject
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "subjectName": "Mathematics",
    "standard": "10",
    "division": "A",
    "duration": 60,
    "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry."
  }'
```

#### Get All Teacher's Subjects
```bash
curl -X GET http://localhost:3000/api/v1/teacher/subjects \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN"
```

#### Get Specific Subject
```bash
curl -X GET http://localhost:3000/api/v1/teacher/subjects/1 \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN"
```

#### Update Subject
```bash
curl -X PUT http://localhost:3000/api/v1/teacher/subjects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN" \
  -d '{
    "duration": 90,
    "content": "Updated content with more practical examples."
  }'
```

#### Delete Subject
```bash
curl -X DELETE http://localhost:3000/api/v1/teacher/subjects/1 \
  -H "Authorization: Bearer YOUR_TEACHER_TOKEN"
```

### Postman Collection Example

#### 1. Add Mathematics Subject
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A",
  "duration": 60,
  "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry."
}
```

#### 2. Get All Subjects
**Request:**
- Method: `GET`
- URL: `{{base_url}}/teacher/subjects`
- Headers: `Authorization: Bearer {{teacher_token}}`

#### 3. Update Subject
**Request:**
- Method: `PUT`
- URL: `{{base_url}}/teacher/subjects/{{subject_id}}`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "Advanced Mathematics",
  "duration": 90,
  "content": "Updated content with more advanced topics."
}
```

## Security Features

### Authorization
- Teachers can only access/modify their own subjects
- JWT token validation for all requests
- Automatic teacherId extraction from token

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Best Practices

### For Development
1. Test with different teachers
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
- **Solution**: Ensure teacher is modifying their own subjects

### Token Issues
- **Problem**: "Invalid token" error
- **Solution**: Re-login to get fresh token

### Validation Errors
- **Problem**: Field validation fails
- **Solution**: Check field requirements and format

### Duplicate Subjects
- **Problem**: "Subject already exists" error
- **Solution**: Use different subject name or standard/division

## Example Workflow

### Step 1: Teacher Login
```bash
curl -X POST http://localhost:3000/api/v1/teacher/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@example.com",
    "password": "password123"
  }'
```

### Step 2: Extract Token
Copy the token from the login response and set it as an environment variable.

### Step 3: Add Subject
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subjectName": "Physics",
    "standard": "12",
    "division": "A",
    "duration": 75,
    "content": "Advanced physics concepts including mechanics and thermodynamics."
  }'
```

### Step 4: Get All Subjects
```bash
curl -X GET http://localhost:3000/api/v1/teacher/subjects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Scenarios

### Valid Scenarios
1. ✅ Teacher adds new subject
2. ✅ Teacher views their subjects
3. ✅ Teacher updates their subject
4. ✅ Teacher deletes their subject

### Invalid Scenarios
1. ❌ Teacher modifies another teacher's subject
2. ❌ Request without authentication
3. ❌ Request with invalid token
4. ❌ Duplicate subject creation

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