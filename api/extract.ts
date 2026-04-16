import Anthropic from '@anthropic-ai/sdk';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Allow up to 6MB body — covers a ~4MB PDF after base64 encoding overhead
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

const anthropic = new Anthropic();

function buildPrompt(title: string, department: string, now: string): string {
  return `Analyse this PDF government form and extract all form fields.

The form is titled "${title}" and belongs to "${department}".

Return a single JSON object with this exact structure — no markdown fences, no extra text, only the JSON:

{
  "id": "<kebab-case slug from the title>",
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
      "id": "<kebab-case>",
      "title": "<section heading from the form>",
      "description": "<brief description>",
      "order": 1
    }
  ],
  "fields": [
    {
      "id": "<kebab-case>",
      "type": "<one of: text | textarea | date | number | radio | checkbox | select | email | tel | postcode>",
      "label": "<exact label text from the form>",
      "hint": "<hint text if present, otherwise omit>",
      "options": [{ "label": "...", "value": "..." }],
      "validation": [
        { "type": "required", "message": "Enter <field label>" }
      ],
      "sectionId": "<matching section id>",
      "order": 1,
      "extracted": {
        "confidence": 0.95,
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
- Group fields logically into sections based on the form's visual layout
- Confidence scoring: 0.90–0.98 for clearly legible fields, 0.75–0.89 for fields needing interpretation, below 0.75 for ambiguous or unclear fields
- Set needsReview: true for any field with confidence below 0.75
- Use GDS field types: postcode for postcodes, tel for phone numbers, date for date fields, email for email addresses
- Include required validation on all mandatory fields
- For radio, checkbox, and select fields, include all visible options
- Set sourcePDF.extractionConfidence to the average confidence across all fields
- Return ONLY the JSON object`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on this server' });
  }

  const { pdf, title, department } = req.body as {
    pdf: string;
    title: string;
    department: string;
  };

  if (!pdf || !title || !department) {
    return res.status(400).json({ error: 'Missing required fields: pdf, title, department' });
  }

  const now = new Date().toISOString();

  try {
    // Claude supports PDF documents natively via the document content type.
    // The 'as any' cast is required because the SDK's TypeScript types lag
    // slightly behind the API's supported content block types.
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system:
        'You are a government form analysis assistant. You extract structured form data from PDFs and return it as JSON only. Never include markdown formatting in your response.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdf,
              },
            } as any,
            {
              type: 'text',
              text: buildPrompt(title, department, now),
            },
          ],
        },
      ],
    });

    const rawText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip accidental markdown code fences if Claude adds them
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const form = JSON.parse(cleaned);

    return res.status(200).json({ form });
  } catch (err) {
    const errorMessage =
      err instanceof SyntaxError
        ? 'Claude returned unexpected output — could not parse JSON'
        : err instanceof Error
        ? err.message
        : 'Extraction failed';

    return res.status(500).json({ error: errorMessage });
  }
}
