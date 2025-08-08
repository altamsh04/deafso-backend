# DeafSo Backend API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All teacher endpoints require authentication using Bearer token in the Authorization header:
```
Authorization: Bearer <teacher_jwt_token>
```

## Teacher Subject Management Endpoints

### Understanding teacherId

**Important**: You do NOT need to pass `teacherId` in the request body. The `teacherId` is automatically extracted from the JWT token when the teacher is authenticated.

#### How teacherId Works:

1. **Authentication**: When a teacher logs in, they receive a JWT token
2. **Token Decoding**: The token contains the teacher's ID
3. **Automatic Extraction**: The `authenticateTeacher` middleware automatically extracts the teacher's ID from the token
4. **Request Object**: The teacher's ID is available as `req.teacher.id` in the controller
5. **Database Association**: Subjects are automatically associated with the authenticated teacher

#### Example Flow:
```
1. Teacher Login → Get JWT Token
2. Include Token in Request Header → Authorization: Bearer <token>
3. Middleware Decodes Token → Extracts teacherId
4. Controller Uses teacherId → req.teacher.id
5. Subject Created → Associated with teacher automatically
```

#### ❌ What NOT to do (Don't include teacherId in body):
```json
{
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A",
  "teacherId": 1  // ❌ DON'T include this
}
```

#### ✅ What TO do (Correct way):
```json
{
  "subjectName": "Mathematics",
  "standard": "10",
  "division": "A"
}
```

**Headers (Required):**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

### 1. Add a New Subject
**POST** `/teacher/subjects`

Add a new subject to the database. Only authenticated teachers can add subjects. The `teacherId` is automatically extracted from the JWT token.

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

**Validation Errors (400 Bad Request):**
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

**Duplicate Subject Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Subject already exists for this standard and division"
}
```

### 2. Get All Teacher's Subjects
**GET** `/teacher/subjects`

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
**GET** `/teacher/subjects/:subjectId`

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
**PUT** `/teacher/subjects/:subjectId`

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
**DELETE** `/teacher/subjects/:subjectId`

Delete a subject. Only the teacher who created the subject can delete it.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

## Field Validation Rules

### Subject Fields:
- **subjectName**: Required, 2-100 characters
- **standard**: Required, must be one of: "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
- **division**: Required, 1-5 characters
- **duration**: Optional, non-negative integer (default: 0)
- **content**: Optional, max 10000 characters

### Unique Constraints:
- Subject name must be unique per standard and division combination
- Teachers can only access/modify their own subjects

## Error Responses

### Authentication Errors (401 Unauthorized):
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

### Server Errors (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Example Usage with cURL

### Add a new subject:

**Basic CURL Request (Mathematics):**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Mathematics",
    "standard": "10",
    "division": "A",
    "duration": 60,
    "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry."
  }'
```

**Physics Subject:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Physics",
    "standard": "12",
    "division": "B",
    "duration": 75,
    "content": "Advanced physics concepts including mechanics, thermodynamics, electromagnetism, and modern physics. Practical experiments and problem-solving exercises included."
  }'
```

**English Literature:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "English Literature",
    "standard": "11",
    "division": "C",
    "duration": 45,
    "content": "Study of classic and contemporary literature. Reading comprehension, essay writing, poetry analysis, and creative writing skills development."
  }'
```

**Computer Science:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Computer Science",
    "standard": "9",
    "division": "A",
    "duration": 90,
    "content": "Introduction to programming concepts, algorithms, data structures, and software development. Hands-on coding projects and problem-solving exercises."
  }'
```

**Chemistry (Minimal Content):**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Chemistry",
    "standard": "8",
    "division": "B",
    "duration": 50
  }'
```

**History (Long Content):**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "History",
    "standard": "7",
    "division": "A",
    "duration": 40,
    "content": "Comprehensive study of world history from ancient civilizations to modern times. Topics include: Ancient Egypt, Greek and Roman civilizations, Medieval period, Renaissance, Industrial Revolution, World Wars, and contemporary history. Students will develop critical thinking skills through analysis of historical events, primary sources, and cultural developments."
  }'
```

### Using Variables for Easier Testing:

**Set up environment variables:**
```bash
# Set your JWT token
export TOKEN="your_jwt_token_here"

# Set base URL
export API_BASE="http://localhost:3000/api/v1"
```

**Then use the variables:**
```bash
curl -X POST $API_BASE/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "subjectName": "Biology",
    "standard": "11",
    "division": "A",
    "duration": 65,
    "content": "Study of living organisms, their structure, function, growth, evolution, and distribution. Topics include cell biology, genetics, ecology, and human anatomy."
  }'
```

### Testing with Different Scenarios:

**1. Required Fields Only:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Geography",
    "standard": "6",
    "division": "B"
  }'
```

**2. With All Optional Fields:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Art & Design",
    "standard": "9",
    "division": "C",
    "duration": 80,
    "content": "Creative arts and design principles. Students will explore various mediums including drawing, painting, sculpture, and digital art. Focus on developing artistic skills, creativity, and appreciation for different art forms and cultural expressions."
  }'
```

**3. Using a JSON file:**
```bash
# Create a file named subject.json
echo '{
  "subjectName": "Economics",
  "standard": "12",
  "division": "A",
  "duration": 70,
  "content": "Study of economic principles, market structures, supply and demand, monetary policy, and international trade. Students will analyze economic data and develop critical thinking skills for economic decision-making."
}' > subject.json

# Use the file in the request
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d @subject.json
```

### Error Testing Examples:

**1. Missing Required Field:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Mathematics",
    "standard": "10"
  }'
```

**2. Invalid Standard:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subjectName": "Mathematics",
    "standard": "13",
    "division": "A"
  }'
```

**3. Missing Authentication:**
```bash
curl -X POST http://localhost:3000/api/v1/teacher/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "subjectName": "Mathematics",
    "standard": "10",
    "division": "A"
  }'
```

### Get all teacher's subjects:
```bash
curl -X GET http://localhost:3000/api/v1/teacher/subjects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a subject:
```bash
curl -X PUT http://localhost:3000/api/v1/teacher/subjects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "duration": 90,
    "content": "Updated physics content with more practical examples."
  }'
```

### Delete a subject:
```bash
curl -X DELETE http://localhost:3000/api/v1/teacher/subjects/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
``` 

## Postman Testing Guide

### Setting Up Postman for API Testing

#### 1. Create a New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it "DeafSo Teacher API"
4. Add description: "API testing for teacher subject management"

#### 2. Set Up Environment Variables
1. Click "Environments" → "New Environment"
2. Name it "DeafSo Local"
3. Add these variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `teacher_token`: `your_jwt_token_here`
   - `student_token`: `your_student_jwt_token_here`

#### 3. Authentication Setup
1. In your collection, go to "Authorization" tab
2. Set Type to "Bearer Token"
3. Set Token to: `{{teacher_token}}`

#### 4. Understanding teacherId
**Important**: The `teacherId` is automatically handled by the system:
- When you include the JWT token in the Authorization header, the system automatically extracts the teacher's ID
- You do NOT need to pass `teacherId` in the request body
- The system automatically associates subjects with the authenticated teacher
- This ensures security - teachers can only create subjects for themselves

### Postman Request Examples

#### 1. Teacher Login (Get Token)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Teacher logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "teacher": {
      "id": 1,
      "fullname": "John Doe",
      "email": "teacher@example.com"
    }
  }
}
```

**Steps:**
1. Copy the token from response
2. Update environment variable `teacher_token` with this value

#### 2. Add New Subject (Mathematics)
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
  "content": "Advanced mathematics concepts including algebra, geometry, and trigonometry. Topics covered: Quadratic equations, coordinate geometry, trigonometry, statistics, and probability."
}
```

**Note**: The `teacherId` is automatically extracted from the JWT token. You do NOT need to include it in the request body.

#### 3. Add New Subject (Physics)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "Physics",
  "standard": "12",
  "division": "B",
  "duration": 75,
  "content": "Advanced physics concepts including mechanics, thermodynamics, electromagnetism, and modern physics. Practical experiments and problem-solving exercises included."
}
```

#### 4. Add New Subject (English Literature)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "English Literature",
  "standard": "11",
  "division": "C",
  "duration": 45,
  "content": "Study of classic and contemporary literature. Reading comprehension, essay writing, poetry analysis, and creative writing skills development."
}
```

#### 5. Add New Subject (Computer Science)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "Computer Science",
  "standard": "9",
  "division": "A",
  "duration": 90,
  "content": "Introduction to programming concepts, algorithms, data structures, and software development. Hands-on coding projects and problem-solving exercises."
}
```

#### 6. Add New Subject (Minimal Fields)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "Geography",
  "standard": "6",
  "division": "B"
}
```

### Other Teacher API Endpoints

#### 7. Get All Teacher's Subjects
**Request:**
- Method: `GET`
- URL: `{{base_url}}/teacher/subjects`
- Headers: `Authorization: Bearer {{teacher_token}}`

#### 8. Get Specific Subject
**Request:**
- Method: `GET`
- URL: `{{base_url}}/teacher/subjects/1`
- Headers: `Authorization: Bearer {{teacher_token}}`

#### 9. Update Subject
**Request:**
- Method: `PUT`
- URL: `{{base_url}}/teacher/subjects/1`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{teacher_token}}`
- Body (raw JSON):
```json
{
  "subjectName": "Advanced Mathematics",
  "duration": 90,
  "content": "Updated content with more advanced topics and practical examples."
}
```

#### 10. Delete Subject
**Request:**
- Method: `DELETE`
- URL: `{{base_url}}/teacher/subjects/1`
- Headers: `Authorization: Bearer {{teacher_token}}`

### Postman Testing Workflow

#### Step 1: Teacher Authentication
1. Create "Teacher Login" request
2. Send request with teacher credentials
3. Copy token from response
4. Update `teacher_token` environment variable

#### Step 2: Add Subjects
1. Create "Add Mathematics Subject" request
2. Send request
3. Verify 201 status code and response
4. Repeat for other subjects

#### Step 3: Test Other Operations
1. Get all subjects
2. Get specific subject by ID
3. Update a subject
4. Delete a subject

### Error Testing in Postman

#### 1. Missing Authentication
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: `Content-Type: application/json`
- Body: Same as above (no Authorization header)

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

#### 2. Invalid Token
**Request:**
- Method: `POST`
- URL: `{{base_url}}/teacher/subjects`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer invalid_token_here`
- Body: Same as above

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid token."
}
```

#### 3. Missing Required Fields
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
  "standard": "10"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "division",
      "message": "Division must be between 1 and 5 characters"
    }
  ]
}
```

#### 4. Duplicate Subject
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
  "division": "A"
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Subject already exists for this standard and division"
}
```

### Postman Collection Export

You can save this as a Postman collection file (JSON) and import it:

```json
{
  "info": {
    "name": "DeafSo Teacher API",
    "description": "API testing for teacher subject management",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1"
    }
  ],
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{teacher_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Teacher Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"teacher@example.com\",\n  \"password\": \"password123\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/teacher/login",
          "host": ["{{base_url}}"],
          "path": ["teacher", "login"]
        }
      }
    },
    {
      "name": "Add Mathematics Subject",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"subjectName\": \"Mathematics\",\n  \"standard\": \"10\",\n  \"division\": \"A\",\n  \"duration\": 60,\n  \"content\": \"Advanced mathematics concepts including algebra, geometry, and trigonometry.\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/teacher/subjects",
          "host": ["{{base_url}}"],
          "path": ["teacher", "subjects"]
        }
      }
    }
  ]
}
```

### Tips for Postman Testing

1. **Use Environment Variables**: Set up variables for base URL and tokens
2. **Save Responses**: Use Postman's "Save Response" feature to store successful responses
3. **Test Scripts**: Add test scripts to validate responses automatically
4. **Pre-request Scripts**: Use to set up dynamic values
5. **Collection Runner**: Run multiple requests in sequence
6. **Environment Switching**: Create different environments for dev/staging/prod

### Example Test Script

Add this to your requests to validate responses:

```javascript
// Test script for Add Subject
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success true", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.eql(true);
});

pm.test("Subject name is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.subjectName).to.eql("Mathematics");
});

pm.test("Teacher ID is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.teacher.id).to.be.a('number');
});
```

This comprehensive Postman guide should help you test all the teacher subject API endpoints effectively! 