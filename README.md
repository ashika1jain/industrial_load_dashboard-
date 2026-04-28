# Industrial Load Forecasting & Contract Demand Alert System

A full-stack web application that predicts factory electricity load and alerts operators before contract demand violations occur — helping industries avoid penalty charges.

## Live Demo

**Frontend:** https://industrial-load-dashboard-snkr.vercel.app  
**Backend API:** https://industrial-load-dashboard.onrender.com

---

## Problem Statement

Factories operating under contracted demand agreements face financial penalties when their electricity consumption exceeds the agreed threshold. The penalty is calculated on peak demand — not average consumption — meaning a single hour of overrun can result in a significant charge. Most industrial units have no way to anticipate this in advance.

---

## Solution

This system accepts historical hourly load data (CSV upload), applies a trained Machine Learning model to generate next-day and next-week forecasts, and displays a real-time **Safe** or **Risk** alert based on whether the predicted load is likely to exceed the user-defined contract demand limit.

---

## Features

- Upload historical electricity load data as CSV
- Predict next 24-hour and next 7-day load using Random Forest Regression
- Real-time Safe / Risk alert against contract demand threshold
- Interactive dashboard with load charts and KPI cards
- Per-user prediction history stored in cloud database
- Factory settings with contract demand auto-fill on login
- Secure API with rate limiting and input validation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Next.js 16, Tailwind CSS, shadcn/ui |
| Charts | Recharts |
| Backend | FastAPI, Python 3.13, Uvicorn |
| ML Model | scikit-learn (RandomForestRegressor) |
| Data Processing | pandas, numpy |
| Database | Neon PostgreSQL (cloud) |
| Authentication | Clerk |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git + GitHub |

---

## ML Model

- **Algorithm:** Random Forest Regressor
- **Training Data:** 1 year of synthetic hourly factory load data (8,760 rows)
- **Features (10):** hour, day_of_week, month, is_weekend, day_of_year, lag_1h, lag_24h, lag_168h, rolling_3h, rolling_24h
- **Train/Test Split:** 80/20 (time-based, no shuffle)
- **Results:**

| Metric | Value |
|--------|-------|
| MAE | 15.44 kW |
| RMSE | 19.44 kW |
| MAPE | 8.09% (~92% accuracy) |

- **Most Important Feature:** lag_168h (same hour last week) — importance score 0.963

---

## Project Structure

```
industrial_load_dashboard-/
├── frontend/          # Next.js React application
│   ├── app/           # Pages (dashboard, settings)
│   ├── components/    # React components
│   └── lib/           # API utility functions
├── backend/           # FastAPI Python application
│   ├── main.py        # API endpoints
│   ├── model.py       # ML inference
│   ├── utils.py       # Data processing
│   ├── database.py    # Neon PostgreSQL
│   └── schemas.py     # Pydantic models
└── ml_model/          # ML training
    ├── load_forecasting.ipynb
    ├── load_prediction_model.pkl
    └── model_features.pkl
```

---

## Local Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:
```
DATABASE_URL=your_neon_connection_string
ALLOWED_ORIGIN=http://localhost:3000
```

Run:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

Run:
```bash
npm run dev
```

Open: http://localhost:3000

---

## API Endpoints

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| /health | GET | Health check | 30/min |
| /predict | POST | Run load prediction | 10/min |
| /predictions | GET | Get prediction history | 30/min |
| /settings | GET | Get user settings | 30/min |
| /settings | POST | Save user settings | 10/min |

---

## CSV Format

Upload a CSV file with exactly two columns:

```
datetime,load_kw
2024-01-01 00:00:00,320.5
2024-01-01 01:00:00,310.2
```

**Requirements:** Minimum 168 rows, maximum 10,000 rows, file size under 5 MB.

---

## Security

- Rate limiting via SlowAPI
- Strict input validation (file type, size, columns, row count)
- CORS restricted to deployed frontend origin
- All secrets managed via environment variables
- No credentials hardcoded in source code

---

## Academic Context 
**Medicaps University, Indore**  
B.Tech Computer Science & Engineering — Minor Project 2026
