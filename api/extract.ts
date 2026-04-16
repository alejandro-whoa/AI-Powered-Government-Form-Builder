import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Allow up to 6MB body — covers a ~4MB PDF after base64 encoding overhead
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

// LiteLLM exposes an OpenAI-compatible API.
// We point the OpenAI SDK at the LiteLLM proxy instead of OpenAI's servers.
const client = new OpenAI({
  baseURL: process.env.LITELLM_BASE_URL ?? 'https://licenseportal.aiengineeringlab.co.uk/v1',
  apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

// Best available model in the LiteLLM instance
const MODEL = 'eu.anthropic.claude-sonnet-4-6';

function buildPrompt(title: string, department: string, now: string, pdfText: string): string {
  return `You are analysing the text extracted from a government PDF form titled "${title}" from "${department}".

Here is the extracted text from the PDF:
---
${pdfText.slice(0, 8000)}
---

Extract all form fields from this text and return a single JSON object. Return ONLY the JSON — no markdown fences, no explanations.

The JSON must match this structure exactly:

{
  "id": "<kebab-case slug from the title, e.g. 'blue-badge-application'>",
  "title": "${title}",
  "description": "<one sentence describing the form's purpose>",
  "department": "${department}",
  "version": {
    "versionNumber": "1.0.0-draft",
    "status": "draft",
    "createdAt": "${now}",
    "createdBy": "ai-extraction"
  },
  "sections": [
    {
      "id": "<kebab-case section id>",
      "title": "<section heading from the form>",
      "description": "<brief description of this section>",
      "order": 1
    }
  ],
  "fields": [
    {
      "id": "<kebab-case field id>",
      "type": "<one of: text | textarea | date | number | radio | checkbox | select | email | tel | postcode>",
      "label": "<exact label text from the form>",
      "hint": "<hint or help text if present, otherwise omit this key>",
      "options": [{ "label": "Option label", "value": "option-value" }],
      "validation": [
        { "type": "required", "message": "Enter <field label>" }
      ],
      "sectionId": "<matching section id>",
      "order": 1,
      "extracted": {
        "confidence": 0.92,
        "suggestedType": "<same as type>",
        "needsReview": false
      }
    }
  ],
  "createdAt": "${now}",
  "updatedAt": "${now}",
  "sourcePDF": {
    "filename": "uploaded-form.pdf",
    "uploadedAt": "${now}",
    "uploadedBy": "service-owner",
    "extractionConfidence": 0.88
  }
}

Rules:
- Group fields logically into sections based on the form's structure
- Confidence: 0.90–0.98 for clearly readable fields, 0.75–0.89 for fields needing interpretation, below 0.75 for ambiguous fields
- Set needsReview: true for confidence below 0.75
- Use GDS-appropriate types: postcode for postcodes, tel for phone numbers, date for dates, email for email addresses
- Include required validation on all mandatory fields
- Include options array for radio, checkbox, and select fields
- Set sourcePDF.extractionConfidence to the average confidence across all fields
- Return ONLY the JSON object, nothing else`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on this server' });
  }

  const { pdf, title, department } = req.body as {
    pdf: string;
    title: string;
    department: string;
  };

  if (!pdf || !title || !department) {
    return res.status(400).json({ error: 'Missing required fields: pdf, title, department' });
  }

  try {
    // Step 1: Extract text from the PDF using pdf-parse
    const pdfBuffer = Buffer.from(pdf, 'base64');
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    if (!pdfText || pdfText.trim().length < 20) {
      return res.status(422).json({
        error: 'Could not extract text from this PDF. It may be a scanned image. Try a digitally-generated PDF.',
      });
    }

    // Step 2: Send extracted text to Claude via LiteLLM
    const now = new Date().toISOString();

    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'system',
          content:
            'You are a government form analysis assistant. You extract structured form data from text and return valid JSON only. Never include markdown formatting or explanations in your response.',
        },
        {
          role: 'user',
          content: buildPrompt(title, department, now, pdfText),
        },
      ],
    });

    const rawText = completion.choices[0]?.message?.content ?? '';

    // Strip any accidental markdown fences
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const form = JSON.parse(cleaned);

    return res.status(200).json({ form });
  } catch (err) {
    const errorMessage =
      err instanceof SyntaxError
        ? 'The AI returned an unexpected response — please try again'
        : err instanceof Error
        ? err.message
        : 'Extraction failed';

    return res.status(500).json({ error: errorMessage });
  }
}
