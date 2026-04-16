import OpenAI from 'openai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb', // plain text is tiny compared to base64 PDF
    },
  },
};

// LiteLLM exposes an OpenAI-compatible API.
const client = new OpenAI({
  baseURL: process.env.LITELLM_BASE_URL ?? 'https://licenseportal.aiengineeringlab.co.uk/v1',
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

const MODEL = 'eu.anthropic.claude-haiku-4-5-20251001-v1:0';

function buildPrompt(title: string, department: string, now: string, pdfText: string): string {
  return `You are analysing text extracted from a government PDF form titled "${title}" from "${department}".

Extracted text:
---
${pdfText.slice(0, 8000)}
---

Extract all form fields and return a single JSON object. Return ONLY valid JSON — no markdown, no explanation.

{
  "id": "<kebab-case slug from title>",
  "title": "${title}",
  "description": "<one sentence about the form's purpose>",
  "department": "${department}",
  "version": { "versionNumber": "1.0.0-draft", "status": "draft", "createdAt": "${now}", "createdBy": "ai-extraction" },
  "sections": [{ "id": "<kebab-case>", "title": "<heading>", "description": "<brief>", "order": 1 }],
  "fields": [{
    "id": "<kebab-case>",
    "type": "<text|textarea|date|number|radio|checkbox|select|email|tel|postcode>",
    "label": "<exact label>",
    "hint": "<hint text if present>",
    "options": [{ "label": "...", "value": "..." }],
    "validation": [{ "type": "required", "message": "Enter <label>" }],
    "sectionId": "<section id>",
    "order": 1,
    "extracted": { "confidence": 0.92, "suggestedType": "<type>", "needsReview": false }
  }],
  "createdAt": "${now}",
  "updatedAt": "${now}",
  "sourcePDF": { "filename": "uploaded-form.pdf", "uploadedAt": "${now}", "uploadedBy": "service-owner", "extractionConfidence": 0.88 }
}

Rules:
- Group fields into sections based on the form layout
- Confidence: 0.90–0.98 clearly readable, 0.75–0.89 uncertain, below 0.75 ambiguous
- needsReview: true when confidence < 0.75
- Use GDS types: postcode, tel, email, date where appropriate
- Include options for radio/checkbox/select fields
- Return ONLY the JSON object`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on this server' });
  }

  const { text, title, department } = req.body as {
    text: string;
    title: string;
    department: string;
  };

  if (!text || !title || !department) {
    return res.status(400).json({ error: 'Missing required fields: text, title, department' });
  }

  if (text.trim().length < 20) {
    return res.status(422).json({
      error: 'Not enough text could be read from this PDF. Try a digitally-generated PDF rather than a scanned one.',
    });
  }

  try {
    const now = new Date().toISOString();

    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content: 'You are a government form analysis assistant. Return valid JSON only. No markdown, no explanations.',
        },
        {
          role: 'user',
          content: buildPrompt(title, department, now, text),
        },
      ],
    });

    const rawText = completion.choices[0]?.message?.content ?? '';

    // Log as error so it appears in Vercel's filtered log view
    console.error('RAW MODEL RESPONSE:', rawText.slice(0, 1000));

    // Extract JSON by finding the outermost { } — works regardless of
    // whether the model wraps it in markdown fences or adds extra text
    const jsonStart = rawText.indexOf('{');
    const jsonEnd = rawText.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('NO JSON FOUND IN RESPONSE. Full text:', rawText.slice(0, 2000));
      throw new SyntaxError('No JSON found in model response');
    }
    const form = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    return res.status(200).json({ form });
  } catch (err) {
    console.error('EXTRACT ERROR:', err instanceof Error ? err.message : err);
    const message =
      err instanceof SyntaxError
        ? 'The AI returned an unexpected response — please try again'
        : err instanceof Error
        ? err.message
        : 'Extraction failed';
    return res.status(500).json({ error: message });
  }
}
