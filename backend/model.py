import joblib
import pandas as pd
import numpy as np
from datetime import timedelta
from utils import add_features, clean_data

def load_model(model_path, features_path):
    """
    Loads the trained model and feature list from .pkl files
    """
    model = joblib.load(model_path)
    features = joblib.load(features_path)
    return model, features


def predict_future(df, model, features, hours=24):
    """
    Predicts load for next N hours iteratively.
    Uses previous predictions as input for next step.
    """
    # Work on a copy, keep enough history for lag features
    temp_df = df.tail(200).copy().reset_index(drop=True)
    predictions = []
    last_datetime = temp_df["datetime"].iloc[-1]

    for i in range(hours):
        # Next timestamp
        next_datetime = last_datetime + timedelta(hours=i+1)

        # Add new row with NaN load
        new_row = pd.DataFrame([{
            "datetime": next_datetime,
            "load_kw": np.nan
        }])
        temp_df = pd.concat([temp_df, new_row], ignore_index=True)

        # Add features WITHOUT dropping NaN rows this time
        temp_df["hour"]        = temp_df["datetime"].dt.hour
        temp_df["day_of_week"] = temp_df["datetime"].dt.dayofweek
        temp_df["month"]       = temp_df["datetime"].dt.month
        temp_df["is_weekend"]  = (temp_df["day_of_week"] >= 5).astype(int)
        temp_df["day_of_year"] = temp_df["datetime"].dt.dayofyear
        temp_df["lag_1h"]      = temp_df["load_kw"].shift(1)
        temp_df["lag_24h"]     = temp_df["load_kw"].shift(24)
        temp_df["lag_168h"]    = temp_df["load_kw"].shift(168)
        temp_df["rolling_3h"]  = temp_df["load_kw"].shift(1).rolling(3).mean()
        temp_df["rolling_24h"] = temp_df["load_kw"].shift(1).rolling(24).mean()

        # Get last row for prediction
        last_row = temp_df[features].iloc[-1]

        # Fill any remaining NaN with 0
        last_row = last_row.fillna(0)

        # Predict
        pred = model.predict([last_row])[0]
        pred = round(float(pred), 2)
        predictions.append(pred)

        # Fill predicted value back for next iteration
        temp_df.at[temp_df.index[-1], "load_kw"] = pred

    return predictions


def predict_next_24h(df, model, features):
    """Predict next 24 hours"""
    return predict_future(df, model, features, hours=24)


def predict_next_week(df, model, features):
    """Predict next 168 hours (7 days)"""
    return predict_future(df, model, features, hours=168)