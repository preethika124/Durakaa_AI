<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b075e3aa-d983-4d78-be5e-bb20e06d0b46

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in `.env` (optional; the scientific fallback works without it).
3. Install dependencies:
   `npm.cmd install` on Windows, or `npm install` on macOS/Linux.
4. Run the app:
   `npm.cmd run dev` on Windows, or `npm run dev` on macOS/Linux.

The unified server starts the FastAPI backend automatically. On Windows it uses
`python`; set `PYTHON_EXECUTABLE` in `.env` if your Python command differs.
