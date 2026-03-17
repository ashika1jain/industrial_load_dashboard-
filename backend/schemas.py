from pydantic import BaseModel
from typing import List

class PredictionResponse(BaseModel):
    """
    This defines the structure of the response
    that our API will return to the frontend.
    """
    next_day_prediction: float
    next_week_prediction: List[float]
    contract_demand: float
    status: str
    alert_message: str