// server.js
// Backend for the AI Resume Builder using Google Gemini.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// Check for Gemini API key
if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY is missing from your .env file.');
}

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST /api/generate-resume
app.post('/api/generate-resume', async (req, res) => {
  try {
    const {
      personal,
      rawSummary,
      experience,
      education,
      skills,
      projects,
    } = req.body;

    // Validate required data
    if (!personal || !personal.name) {
      return res.status(400).json({
        error: 'Missing personal.name in request body',
      });
    }

    // Make sure API key exists
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Check your .env file.',
      });
    }

    const prompt = `
You are a professional resume writer.

Given the raw, unpolished user input below, produce polished,
ATS-friendly resume content.

Rules:
- Be concise and professional.
- Use strong action verbs.
- Quantify achievements only when the information supports it.
- NEVER invent facts, technologies, companies, achievements,
  qualifications, dates, or numbers.
- Improve grammar and wording.
- Keep the information truthful.
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT include markdown code fences.

Return exactly this JSON structure:

{
  "summary": "2-3 sentence professional summary",
  "experience": [
    {
      "title": "...",
      "company": "...",
      "duration": "...",
      "bullets": ["...", "..."]
    }
  ],
  "projects": [
    {
      "name": "...",
      "bullets": ["...", "..."]
    }
  ]
}

RAW INPUT:

Name:
${personal.name}

Target role:
${personal.targetRole || 'Not specified'}

Raw summary/notes:
${rawSummary || 'None provided'}

Experience:
${JSON.stringify(experience || [], null, 2)}

Education:
${JSON.stringify(education || [], null, 2)}

Skills:
${JSON.stringify(skills || [], null, 2)}

Projects:
${JSON.stringify(projects || [], null, 2)}
`;

    // Generate content using Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2000,
      },
    });

    let raw = response.text || '{}';

    console.log('Gemini response received.');

    // Remove accidental markdown fences
    raw = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Parse Gemini JSON response
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:');
      console.error(raw);

      return res.status(502).json({
        error: 'Gemini response was not valid JSON',
        raw,
      });
    }

    // Send result to frontend
    res.json(parsed);

  } catch (err) {
    console.error('Gemini API error:');
    console.error(err);

    res.status(500).json({
      error: err.message || 'Server error',
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Resume Builder running at http://localhost:${PORT}`);
});