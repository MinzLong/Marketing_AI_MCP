# Marketing AI

This repo contains a React frontend (Vite) and a Python Flask backend with a more structured layout for larger projects.

## Structure

Frontend (React):
- `frontend/src/app` entry layout and App shell
- `frontend/src/pages` page-level screens
- `frontend/src/components` reusable UI components
- `frontend/src/hooks` custom React hooks
- `frontend/src/services` API clients
- `frontend/src/styles` global styles

Backend (Flask):
- `backend/app` application package
- `backend/app/api` API blueprints
- `backend/app/services` business logic
- `backend/app/config.py` config
- `backend/run.py` local entrypoint

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

Health check:
- http://localhost:8000/api/health

Optional env:
- Copy `backend/.env.example` to `backend/.env` and adjust origins if needed.

## MCP Setup (Backend)

This backend is set up for the Google Forms MCP server (stdio-based).

Set these in `backend/.env` (see `backend/.env.example`):
- `MCP_GOOGLE_FORMS_STDIO_COMMAND`
- `MCP_GOOGLE_FORMS_STDIO_ARGS`
- `MCP_GOOGLE_FORMS_STDIO_ENV`
- `MCP_GOOGLE_FORMS_STDIO_CWD`

Example:
```
MCP_GOOGLE_FORMS_STDIO_COMMAND=node
MCP_GOOGLE_FORMS_STDIO_ARGS=["./google-forms-mcp/build/index.js"]
MCP_GOOGLE_FORMS_STDIO_ENV={"GOOGLE_CLIENT_ID":"...","GOOGLE_CLIENT_SECRET":"...","GOOGLE_REFRESH_TOKEN":"..."}
MCP_GOOGLE_FORMS_STDIO_CWD=./google-forms-mcp
```

## GPT Form Generator (Backend)

Set OpenAI credentials in `backend/.env`:
```
OPENAI_API_KEY=YOUR_KEY
OPENAI_MODEL=gpt-4.1
```

Generate a form from a prompt (creates the form + adds questions):
```
POST http://localhost:8000/api/forms/generate
{
  "topic": "Customer satisfaction for a coffee shop",
  "audience": "Walk-in customers",
  "language": "Vietnamese",
  "num_questions": 6
}
```

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:
- http://localhost:5173

The Vite dev server proxies `/api` to the backend on port 8000.
