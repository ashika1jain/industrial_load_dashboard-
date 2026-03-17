import pandas as pd
import numpy as np

def clean_data(df):
    """
    Cleans the uploaded CSV data.
    - Fixes datetime format
    - Removes missing values
    - Removes negative load values
    - Removes duplicate rows
    """
    # Fix datetime column
    df["datetime"] = pd.to_datetime(df["datetime"], errors="coerce")

    # Remove rows where datetime could not be parsed
    df = df.dropna(subset=["datetime"])

    # Remove negative or zero load values
    df = df[df["load_kw"] > 0]

    # Remove duplicate rows
    df = df.drop_duplicates(subset=["datetime"])

    # Sort by datetime
    df = df.sort_values("datetime").reset_index(drop=True)

    return df


def add_features(df):
    """
    Adds time-based and lag features.
    Same as training — must stay consistent.
    """
    df = df.copy()

    # Time based features
    df["hour"]         = df["datetime"].dt.hour
    df["day_of_week"]  = df["datetime"].dt.dayofweek
    df["month"]        = df["datetime"].dt.month
    df["is_weekend"]   = (df["day_of_week"] >= 5).astype(int)
    df["day_of_year"]  = df["datetime"].dt.dayofyear

    # Lag features
    df["lag_1h"]       = df["load_kw"].shift(1)
    df["lag_24h"]      = df["load_kw"].shift(24)
    df["lag_168h"]     = df["load_kw"].shift(168)

    # Rolling averages
    df["rolling_3h"]   = df["load_kw"].shift(1).rolling(3).mean()
    df["rolling_24h"]  = df["load_kw"].shift(1).rolling(24).mean()

    # Drop NaN rows
    df = df.dropna().reset_index(drop=True)

    return df