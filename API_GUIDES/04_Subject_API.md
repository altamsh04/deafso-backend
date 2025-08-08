# Subject API Guide

## Overview
This guide covers all subject-related endpoints and operations in the DeafSo Backend API.

## Base URL
```
http://localhost:3000/api/v1
```

## Subject Management

### Understanding Subject Structure

A subject in the system contains the following information:
- **Basic Info**: Name, standard, division
- **Content**: Duration, description, content
- **Metadata**: Views, creation date, teacher info
- **Relationships**: Linked to teacher who created it

### Subject Data Model

```json
{
  "id": 1,
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A",
  "duration": 60,
  "content": "Advanced mathematics concepts...",
  "views": 150,
  "teacherId": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "teacher": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john.doe@school.com"
  }
}
```

## Subject Endpoints by Role

### Teacher Subject Management

#### 1. Add New Subject
**Endpoint:** `POST /teacher/subjects`

**Authentication:** Required (Teacher JWT Token)

**Request Body:**
```json
{
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A",
  "duration": 60,
  "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry."
}
```

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

#### 2. Get Teacher's Subjects
**Endpoint:** `GET /teacher/subjects`

**Authentication:** Required (Teacher JWT Token)

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

#### 3. Get Specific Subject
**Endpoint:** `GET /teacher/subjects/:subjectId`

**Authentication:** Required (Teacher JWT Token)

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

#### 4. Update Subject
**Endpoint:** `PUT /teacher/subjects/:subjectId`

**Authentication:** Required (Teacher JWT Token)

**Request Body (all fields optional):**
```json
{
  "subjectName": "Advanced Mathematics",
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
    "standard": "10",
    "division": "A",
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

#### 5. Delete Subject
**Endpoint:** `DELETE /teacher/subjects/:subjectId`

**Authentication:** Required (Teacher JWT Token)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

### Student Subject Access

#### 1. Get Subjects by Standard and Division
**Endpoint:** `GET /student/subjects/:standard/:division`

**Authentication:** Required (Student JWT Token)

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
      "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry.",
      "views": 150,
      "teacher": {
        "id": 1,
        "fullname": "Jane Smith",
        "email": "jane.smith@teacher.com"
      },
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "subjectName": "Physics",
      "standard": "10",
      "division": "A",
      "duration": 75,
      "content": "Advanced physics concepts including mechanics and thermodynamics.",
      "views": 89,
      "teacher": {
        "id": 2,
        "fullname": "Mike Johnson",
        "email": "mike.johnson@teacher.com"
      },
      "created_at": "2024-01-15T11:30:00.000Z",
      "updated_at": "2024-01-15T11:30:00.000Z"
    }
  ],
  "count": 2
}
```

## Field Validation Rules

### Subject Fields
| Field | Type | Required | Min Length | Max Length | Format/Values | Description |
|-------|------|----------|------------|------------|---------------|-------------|
| subjectName | string | ✅ | 2 | 100 | Any text | Subject name |
| standard | string | ✅ | - | - | "1" through "12" | Academic standard |
| division | string | ✅ | 1 | 5 | Any text | Class division |
| duration | integer | ❌ | - | - | Non-negative integer | Duration in minutes |
| content | string | ❌ | - | 10000 | Any text | Subject description |

### URL Parameters
| Parameter | Type | Required | Format | Description |
|-----------|------|----------|--------|-------------|
| subjectId | integer | ✅ | Positive integer | Subject's unique ID |
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
  "message": "Access denied. You can only modify your own subjects."
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

### Not Found Errors (404 Not Found)
```json
{
  "success": false,
  "message": "Subject not found"
}
```

### Duplicate Subject Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Subject already exists for this standard and division"
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
   - `student_token`: `your_student_jwt_token`
   - `subject_id`: `1`

### Teacher Subject Management

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

#### Get Teacher's Subjects
```bash
curl -X GET http://localhost:3000/api/v1/teacher/subjects \
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

### Student Subject Access

#### Get Subjects by Standard and Division
```bash
curl -X GET http://localhost:3000/api/v1/student/subjects/10/A \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

## Subject Examples by Category

### Mathematics Subjects
```json
{
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A",
  "duration": 60,
  "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry. Topics covered: Quadratic equations, coordinate geometry, trigonometry, statistics, and probability."
}
```

### Science Subjects
```json
{
  "subjectName": "Physics",
  "standard": "12",
  "division": "B",
  "duration": 75,
  "content": "Advanced physics concepts including mechanics, thermodynamics, electromagnetism, and modern physics. Practical experiments and problem-solving exercises included."
}
```

```json
{
  "subjectName": "Chemistry",
  "standard": "11",
  "division": "A",
  "duration": 70,
  "content": "Study of chemical reactions, atomic structure, molecular bonding, and organic chemistry. Laboratory experiments and safety protocols included."
}
```

### Language Subjects
```json
{
  "subjectName": "English Literature",
  "standard": "11",
  "division": "C",
  "duration": 45,
  "content": "Study of classic and contemporary literature. Reading comprehension, essay writing, poetry analysis, and creative writing skills development."
}
```

### Computer Science
```json
{
  "subjectName": "Computer Science",
  "standard": "9",
  "division": "A",
  "duration": 90,
  "content": "Introduction to programming concepts, algorithms, data structures, and software development. Hands-on coding projects and problem-solving exercises."
}
```

### Social Studies
```json
{
  "subjectName": "History",
  "standard": "7",
  "division": "A",
  "duration": 40,
  "content": "Comprehensive study of world history from ancient civilizations to modern times. Topics include: Ancient Egypt, Greek and Roman civilizations, Medieval period, Renaissance, Industrial Revolution, World Wars, and contemporary history."
}
```

## Security Features

### Authorization Rules
- **Teachers**: Can only access/modify their own subjects
- **Students**: Can view subjects for any standard/division
- **Authentication**: Required for all subject operations

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Automatic teacherId extraction from JWT

## Best Practices

### For Development
1. Test with different user roles
2. Verify authorization rules
3. Test validation scenarios
4. Check error handling

### For Production
1. Implement rate limiting
2. Add request logging
3. Set up monitoring
4. Use HTTPS for all requests

## Common Issues

### Authorization Issues
- **Problem**: "Access denied" error
- **Solution**: Ensure user has proper permissions

### Validation Errors
- **Problem**: Field validation fails
- **Solution**: Check field requirements and format

### Duplicate Subjects
- **Problem**: "Subject already exists" error
- **Solution**: Use different subject name or standard/division

### Token Issues
- **Problem**: "Invalid token" error
- **Solution**: Re-login to get fresh token

## Testing Scenarios

### Valid Scenarios
1. ✅ Teacher adds new subject
2. ✅ Teacher views their subjects
3. ✅ Teacher updates their subject
4. ✅ Teacher deletes their subject
5. ✅ Student views subjects for their standard
6. ✅ Student views subjects for other standards

### Invalid Scenarios
1. ❌ Teacher modifies another teacher's subject
2. ❌ Request without authentication
3. ❌ Request with invalid token
4. ❌ Duplicate subject creation
5. ❌ Invalid field values

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

## Database Schema

### Subject Table Structure
```sql
CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  subjectName VARCHAR(100) NOT NULL,
  standard VARCHAR(2) NOT NULL,
  division VARCHAR(5) NOT NULL,
  duration INTEGER DEFAULT 0,
  content TEXT,
  views INTEGER DEFAULT 0,
  teacherId INTEGER REFERENCES teachers(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subjectName, standard, division)
);
```

### Indexes
- `(standard, division)` - For efficient subject lookup
- `(subjectName)` - For subject name searches
- `(teacherId)` - For teacher's subjects lookup 