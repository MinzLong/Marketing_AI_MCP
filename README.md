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

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:
- http://localhost:5173

The Vite dev server proxies `/api` to the backend on port 8000.
