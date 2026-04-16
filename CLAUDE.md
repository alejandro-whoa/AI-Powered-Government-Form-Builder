# AI-Powered Government Form Builder

## What this is

A frontend prototype for a GOV.UK-compliant tool that converts legacy PDF government forms into accessible digital services. The intended workflow is:

1. **Service owner uploads a PDF form** → AI extracts fields, types, labels, and structure
2. **Caseworker reviews the extraction** → corrects errors, sets validation rules and conditional logic
3. **Caseworker publishes the form** → versioned, audited, rollback-capable
4. **Citizen accesses the published form** → fills it in via a GDS-compliant interface and submits

The prototype demonstrates the full end-to-end UI for all three user types (service owner, caseworker, citizen). All AI extraction and data persistence is currently **mocked** — there is no real backend.

---

## How it was built

**Origin:** Designed and exported from Figma Make (https://www.figma.com/design/nnD3OeQQvuuJjRHpvarEMb/AI-Powered-Government-Form-Builder). It is a Figma Make export, not a hand-coded project from scratch.

**Stack:**
- React 18 + TypeScript, built with Vite 6
- React Router 7 (client-side SPA routing via `createBrowserRouter`)
- Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config.js` needed)
- Radix UI primitives + shadcn/ui components (in `src/app/components/ui/`)
- GOV.UK Design System (GDS) — custom wrappers in `src/app/components/gds/`, CSS in `src/styles/govuk.css`
- React Hook Form for form state
- Recharts for any data visualisation
- Package manager: npm (use `npm install` / `npm run dev`)

**Key source locations:**
- `src/app/routes.tsx` — all app routes
- `src/app/components/` — page-level components (Home, UploadPDF, ExtractionPreview, FormBuilder, VersionManagement, PublishedForm, SubmissionConfirmation)
- `src/app/components/gds/` — GDS-compliant input components (Button, Input, Radio, Checkbox, DateInput, Select, Textarea, Header, PhaseBanner)
- `src/app/components/ui/` — 60+ Radix/shadcn primitives
- `src/app/types/schema.ts` — all TypeScript interfaces (`FormSchema`, `FormField`, `FormSection`, `FormVersion`, `FormSubmission`, `AuditLogEntry`)
- `src/app/data/mockData.ts` — hardcoded mock form (Blue Badge Application) with AI confidence scores

**Data model:** `FormSchema` is the central type. It contains `sections[]` and `fields[]`. Each field has an `extracted` object (confidence, boundingBox, suggestedType, needsReview) designed to receive real AI output. `FormVersion` tracks status: draft → review → published → archived.

---

## What was done on 2026-04-16

Prepared the project for GitHub + Vercel deployment. Three issues were fixed:

1. **`package.json`** — `react` and `react-dom` were in `peerDependencies` (optional). Vercel does not install optional peer deps, so the build would fail with a missing React error. Moved both to `dependencies`. Also renamed the package from `@figma/my-make-file` and added a `preview` script.

2. **`vercel.json`** — Created with a catch-all rewrite to `index.html`. Without this, any direct URL or page refresh on a non-root route (e.g. `/builder/123`) returns a 404 because Vercel looks for a static file at that path and finds nothing.

3. **`.gitignore`** — Created. Excludes `node_modules/`, `dist/`, and `.env*` files.

---

## Next steps

### 1. Add a real backend (required before AI or PDF work)

The app is a pure SPA with no server. API keys cannot safely live in the browser. The simplest path is a Node/Express backend or a Next.js migration (which would let you co-locate API routes with the frontend).

A minimal backend needs:
- `POST /api/upload` — receives the PDF file, stores it, triggers extraction
- `GET /api/forms` — returns the list of forms (replaces `mockForms` in Home)
- `GET /api/forms/:id` — returns a single `FormSchema`
- `PUT /api/forms/:id` — saves builder changes
- `POST /api/forms/:id/publish` — publishes a version
- `POST /api/submissions` — handles citizen form submissions

### 2. Connect to an AI API for PDF extraction

Once the backend exists:
1. Install `pdf-parse` (Node) to extract raw text from the uploaded PDF
2. Send the text to Claude via the Anthropic SDK with a structured prompt asking it to return a `FormField[]` array (types, labels, validation hints, confidence scores)
3. Map the response into the `FormSchema` type (`schema.ts` is already designed for this)
4. Replace the hardcoded `mockExtractedForm` in `ExtractionPreview.tsx` with the real API response

The `extracted.confidence`, `extracted.suggestedType`, and `extracted.needsReview` fields on `FormField` are already the right shape to receive AI output.

Environment variable to add (never commit):
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Add PDF generation (output)

Two use cases:
- **Form definition export** — caseworker downloads the form schema as a PDF reference
- **Submission receipt** — citizen gets a PDF copy of what they submitted

Recommended library: `jsPDF` + `jspdf-autotable` for simple tabular output, or `@react-pdf/renderer` if you want a React-component-based approach. Neither requires a backend — they run client-side.

### 4. Add real data persistence

Currently all state is in-memory React state and lost on navigation. Options in order of complexity:
- `localStorage` — fast to add, good enough for a demo
- Supabase — hosted Postgres with a REST/realtime API, low ops overhead, good for a prototype going live
- A custom backend with PostgreSQL — right choice if this goes to production

### 5. Add authentication

No user system exists. Before going live you need at minimum:
- Role separation: service owner / caseworker / citizen have different access to routes
- Consider GOV.UK One Login for citizen-facing auth (government standard)
- For internal users (caseworkers), GOV.UK Sign-in or an organisation SSO

### 6. Complete unfinished features

- **Drag-and-drop field reordering** — `react-dnd` is installed but not wired up in `FormBuilder.tsx`
- **Version rollback** — `VersionManagement.tsx` displays history but has no rollback action
- **State persistence in the builder** — edits are lost on navigation; needs autosave or explicit save-to-backend

---

## Running locally

```bash
npm install
npm run dev        # development server at localhost:5173
npm run build      # production build to dist/
npm run preview    # preview the production build at localhost:4173
```

## Deploying to Vercel

Push to GitHub, import the repo in Vercel. No configuration needed — Vercel auto-detects Vite and `vercel.json` handles SPA routing. Build command is `vite build`, output directory is `dist`.
