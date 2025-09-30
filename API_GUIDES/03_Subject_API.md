# Subject API Documentation

## Overview
The Subject API provides endpoints for teachers to manage educational subjects with PDF content processing and for students to chat with AI assistant about subjects using vector similarity search.

## Authentication
- **Add Subject**: Requires teacher authentication via JWT token
- **Chat with Subject**: Requires student authentication via JWT token

Authorization header format:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Add Subject
**POST** `/api/v1/subject/add-subject`

Adds a new subject with PDF content processing and vector storage.

#### Request Body (multipart/form-data)
- `division` (string, required): Division name
- `standard` (string, required): Standard/grade level
- `subjectName` (string, required): Subject name
- `pdf` (file, required): PDF file containing subject content

#### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/subject/add-subject \
  -H "Authorization: Bearer <teacher_jwt_token>" \
  -F "division=A" \
  -F "standard=10" \
  -F "subjectName=Mathematics" \
  -F "pdf=@/path/to/mathematics.pdf"
```

#### Success Response (201)
```json
{
  "success": true,
  "message": "Subject added successfully",
  "data": {
    "id": 1,
    "subjectId": 1,
    "subjectName": "Mathematics",
    "division": "A",
    "standard": "10",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses
- **400**: Missing required fields or invalid PDF
- **401**: Unauthorized (invalid/missing token)
- **500**: Server error

### 2. Chat with Subject
**POST** `/api/v1/subject/chat`

Students can chat with AI assistant about a specific subject using vector similarity search.

#### Request Body (JSON)
```json
{
  "subjectId": 1,
  "prompt": "Explain quadratic equations"
}
```

#### Example Request
```bash
curl -X POST http://localhost:3000/api/v1/subject/chat \
  -H "Authorization: Bearer <student_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subjectId": 1,
    "prompt": "Explain quadratic equations"
  }'
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "response": "Quadratic equations are polynomial equations of degree 2...",
    "subjectId": 1,
    "subjectName": "Mathematics"
  }
}
```

#### Error Responses
- **400**: Missing subjectId or prompt
- **401**: Unauthorized (invalid/missing student token)
- **404**: Subject not found
- **500**: Server error

## Technical Details

### PDF Processing
- PDFs are parsed using `pdf-parse` library
- Content is split into chunks of 1000 words
- Each chunk is converted to embeddings using Google's `gemini-embedding-001` model
- Vectors are stored as JSON in the database

### AI Chat
- Uses Google's `gemini-1.5-pro` model for responses
- Implements cosine similarity search to find relevant content chunks
- Returns top 3 most relevant chunks as context for the AI response

### File Upload
- Maximum file size: 10MB
- Only PDF files are accepted
- Files are temporarily stored in `uploads/` directory and deleted after processing

## Environment Variables Required
```
GOOGLE_API_KEY=your_google_api_key
```

## Dependencies Added
- `langchain`: AI framework
- `@langchain/google-genai`: Google AI integration
- `pdf-parse`: PDF text extraction
- `multer`: File upload handling
- `pgvector`: Vector database support
