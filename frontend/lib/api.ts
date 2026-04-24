// Base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Type for prediction response from backend
export interface PredictionResponse {
  next_day_prediction: number;
  next_week_prediction: number[];
  contract_demand: number;
  status: "Safe" | "Risk";
  alert_message: string;
}

// Main function to call /predict endpoint
export async function runPrediction(
  file: File,
  contractDemand: number, 
  userId: string = "anonymous"
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("contract_demand", contractDemand.toString());
  formData.append("user_id", userId)

  const response = await fetch(${API_URL}/predict, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Prediction failed");
  }

  return response.json();
}
export interface RecentPrediction {
  id: string
  created_at: string
  contract_demand: number
  next_day_prediction: number
  status: string
  alert_message: string
}

export async function getRecentPredictions(userId: string = "anonymous"): Promise<RecentPrediction[]> {
  const response = await fetch(${API_URL}/predictions?user_id=${userId})
  if (!response.ok) return []
  return response.json()
}

export interface UserSettings {
  user_id?: string
  contract_demand?: number
  factory_name?: string
  industry_type?: string
  location?: string
}

export async function getUserSettings(userId: string): Promise<UserSettings> {
  try {
    const response = await fetch(${API_URL}/settings?user_id=${userId})
    if (!response.ok) return {}
    return response.json()
  } catch {
    return {}
  }
}

export async function saveUserSettings(userId: string, settings: UserSettings): Promise<boolean> {
  try {
    const formData = new FormData()
    formData.append("user_id", userId)
    formData.append("contract_demand", String(settings.contract_demand || 0))
    formData.append("factory_name", settings.factory_name || "")
    formData.append("industry_type", settings.industry_type || "")
    formData.append("location", settings.location || "")

    const response = await fetch(${API_URL}/settings, {
      method: "POST",
      body: formData,
    })
    return response.ok
  } catch {
    return false
  }
}
