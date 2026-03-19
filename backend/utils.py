import pandas as pd
import numpy as np

# Maximum allowed rows in uploaded CSV
MAX_ROWS = 10000
# Minimum required rows for lag features
MIN_ROWS = 168

def validate_csv(df):
    """
    Strictly validates the uploaded CSV.
    - Checks required columns
    - Checks minimum and maximum rows
    - Checks data types
    """
    # Check required columns
    required_columns = {"datetime", "load_kw"}
    if not required_columns.issubset(df.columns):
        raise ValueError("CSV must have 'datetime' and 'load_kw' columns only")

    # Reject unexpected extra columns
    if len(df.columns) > 2:
        raise ValueError("CSV must have exactly 2 columns: 'datetime' and 'load_kw'")

    # Check minimum rows
    if len(df) < MIN_ROWS:
        raise ValueError(f"Please upload at least {MIN_ROWS} rows (1 week) of data")

    # Check maximum rows
    if len(df) > MAX_ROWS:
        raise ValueError(f"CSV too large. Maximum allowed rows: {MAX_ROWS}")

    # Check load_kw is numeric
    if not pd.api.types.is_numeric_dtype(df["load_kw"]):
        raise ValueError("'load_kw' column must contain numeric values only")


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
