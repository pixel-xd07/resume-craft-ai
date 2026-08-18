# AI Resume Builder — MVP

A working end-to-end AI resume builder: fill a form → Claude polishes your raw
notes into professional resume content → live preview → download as PDF.

## What's included
- `server.js` — Express backend, one endpoint (`/api/generate-resume`) that
  calls the Anthropic API to turn your rough notes into polished bullet points
  and a summary.
- `public/index.html` — the entire frontend (form + live preview + PDF
  download). No build step, no framework — just HTML/CSS/JS so you can run it
  immediately and understand every line.
- `package.json` — dependencies.

## Setup (5 minutes)

1. **Install Node.js** (v18+) if you don't have it already.

2. **Install dependencies**
   ```bash
   cd ai-resume-builder
   npm install
   ```

3. **Add your Anthropic API key**
   - Copy `.env.example` to `.env`
   - Get an API key from https://console.anthropic.com (Settings → API Keys)
   - Paste it into `.env`:
     ```
     ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
     ```

4. **Run it**
   ```bash
   npm start
   ```
   Open http://localhost:3000

5. **Use it**
   - Fill in your name, target role, and rough/unpolished notes about your
     experience, projects, and education (don't overthink the wording —
     that's the AI's job).
   - Click "Generate Resume with AI".
   - Review the live preview.
   - Click "Download as PDF".

## How it works
1. Frontend collects raw form data (name, rough notes on experience/projects,
   education, skills).
2. It POSTs that data to `/api/generate-resume`.
3. The backend builds a single prompt instructing Claude to return **strict
   JSON** with a polished summary, experience bullets, and project bullets.
4. The frontend renders that JSON into a styled resume preview.
5. `html2pdf.js` (loaded via CDN) converts the rendered preview div directly
   into a downloadable PDF — no server-side PDF library needed for this MVP.

## Known limitations (intentional, for speed)
- No auth / no saved resumes yet — everything is in-memory in the browser
  tab. Refreshing loses your data.
- One resume template/style only.
- No retry/regenerate button yet for individual sections.
- API key is used server-side only (correct for security) — you must run the
  Node server, this won't work if you just open `index.html` directly in a
  browser.

## Natural next steps (from the earlier roadmap)
- Add Supabase to save resumes per user (you already have Supabase experience
  from the DSA tracker project — same setup).
- Add Supabase Auth so users can log in and edit saved resumes.
- Add multiple resume templates.
- Add a "regenerate this section" button per bullet block instead of
  regenerating the whole resume.
