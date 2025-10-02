const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { SystemMessage, HumanMessage } = require('@langchain/core/messages');
const pdfParse = require('pdf-parse');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: 'gemini-embedding-001',
  apiKey: process.env.GOOGLE_API_KEY
});

const llm = new ChatGoogleGenerativeAI({
  modelName: 'gemini-2.5-flash',
  apiKey: process.env.GOOGLE_API_KEY
});

const addSubject = async (req, res) => {
  try {
    const { division, standard, subjectName } = req.body;
    const teacherId = req.teacher.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const subjectContent = pdfData.text;

    if (!subjectContent || subjectContent.trim().length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'PDF file appears to be empty or corrupted'
      });
    }

    const chunks = splitTextIntoChunks(subjectContent, 1000);
    const vectors = [];

    for (const chunk of chunks) {
      const embedding = await embeddings.embedQuery(chunk);
      vectors.push({
        text: chunk,
        embedding: embedding
      });
    }


    const subject = await prisma.subject.create({
      data: {
        subjectName,
        subjectContent,
        subjectVectors: JSON.stringify(vectors),
        division,
        standard,
        teacherId
      }
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'Subject added successfully',
      data: {
        id: subject.id,
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
        division: subject.division,
        standard: subject.standard,
        createdAt: subject.createdAt
      }
    });

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error('Error adding subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const chatWithSubject = async (req, res) => {
  try {
    const { subjectId, prompt } = req.body;

    if (!subjectId || !prompt) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID and prompt are required'
      });
    }

    const subject = await prisma.subject.findUnique({
      where: { subjectId }
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const vectors = JSON.parse(subject.subjectVectors);
    const promptEmbedding = await embeddings.embedQuery(prompt);

    const relevantChunks = findMostRelevantChunks(vectors, promptEmbedding, 3);
    const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

    const systemMessage = `You are an AI assistant helping students with their studies. Use the following context from the subject material to answer the student's question accurately and helpfully. If the context doesn't contain enough information to answer the question, say so clearly.

Context from subject material:
${context}`;

    const messages = [
      new SystemMessage(systemMessage),
      new HumanMessage(prompt)
    ];

    const response = await llm.invoke(messages);

    res.status(200).json({
      success: true,
      data: {
        response: response.content,
        subjectId: subjectId,
        subjectName: subject.subjectName
      }
    });

  } catch (error) {
    console.error('Error in chat with subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const splitTextIntoChunks = (text, chunkSize) => {
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
};

const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

const findMostRelevantChunks = (vectors, queryEmbedding, topK = 3) => {
  const similarities = vectors.map((vector, index) => ({
    index,
    similarity: cosineSimilarity(vector.embedding, queryEmbedding),
    text: vector.text
  }));
  
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  return similarities.slice(0, topK);
};

const getStudentSubjects = async (req, res) => {
  try {
    const { division, standard } = req.body;

    const subjects = await prisma.subject.findMany({
      where: {
        division,
        standard
      },
      select: {
        subjectId: true,
        subjectName: true,
        division: true,
        standard: true,
        createdAt: true
      }
    });

    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching student subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  addSubject,
  chatWithSubject,
  upload,
  getStudentSubjects
};
