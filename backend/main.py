from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
from utils import clean_data
from model import load_model, predict_next_24h, predict_next_week
from schemas import PredictionResponse

# ─────────────────────────────────────────
# Initialize FastAPI app
# ─────────────────────────────────────────
app = FastAPI(title="Industrial Load Forecasting API")

# ─────────────────────────────────────────
# CORS — Allow frontend to talk to backend
# ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Load ML model at startup
# ─────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH   = os.path.join(BASE_DIR, "../ml_model/load_prediction_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "../ml_model/model_features.pkl")

model, features = load_model(MODEL_PATH, FEATURES_PATH)

# ─────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────

@app.get("/health")
def health_check():
    """Check if backend is running"""
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    file: UploadFile = File(...),
    contract_demand: float = Form(...)
):
    """
    Accepts CSV file + contract demand value.
    Returns next day and next week predictions + alert status.
    """
    # Read uploaded CSV
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    # Validate columns
    if "datetime" not in df.columns or "load_kw" not in df.columns:
        return {"error": "CSV must have 'datetime' and 'load_kw' columns"}

    # Validate minimum rows
    if len(df) < 168:
        return {"error": "Please upload at least 1 week (168 rows) of data"}

    # Clean data
    df = clean_data(df)

    # Predict next 24 hours
    next_day_preds = predict_next_24h(df, model, features)
    next_day_avg   = round(sum(next_day_preds) / len(next_day_preds), 2)

    # Predict next week
    next_week_preds = predict_next_week(df, model, features)

    # Alert logic
    if next_day_avg > contract_demand:
        status = "Risk"
        alert_message = f"⚠️ Predicted load {next_day_avg} kW exceeds contract demand of {contract_demand} kW!"
    else:
        status = "Safe"
        alert_message = f"✅ Predicted load {next_day_avg} kW is within contract demand of {contract_demand} kW."

    return PredictionResponse(
        next_day_prediction=next_day_avg,
        next_week_prediction=next_week_preds,
        contract_demand=contract_demand,
        status=status,
        alert_message=alert_message
    )