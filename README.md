# Marketing AI

This repo contains a React frontend (Vite) and a Python Flask backend.

## Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Health check:
- http://localhost:8000/api/health

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open:
- http://localhost:5173

The Vite dev server proxies `/api` to the backend on port 8000.
