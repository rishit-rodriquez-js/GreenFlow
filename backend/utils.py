"""
GreenFlow ETL - Utility Functions for Data Transformation and Cleaning.
"""

import pandas as pd
import numpy as np
import re
from typing import Tuple, Dict, Any


def standardize_column_name(col_name: str) -> str:
    """
    Standardize column name to lowercase snake_case without leading/trailing whitespace.
    """
    cleaned = str(col_name).strip()
    # Replace non-alphanumeric characters with underscores
    cleaned = re.sub(r'[\s\W]+', '_', cleaned)
    # Remove leading/trailing underscores
    cleaned = cleaned.strip('_').lower()
    return cleaned if cleaned else "unnamed_column"


def clean_dataframe(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Applies the standardized GreenFlow transformation pipeline to a DataFrame:
    1. Standardize column names.
    2. Trim leading/trailing whitespace from string fields.
    3. Remove completely empty rows.
    4. Count missing values before filling.
    5. Fill missing / empty values with 'Unknown'.
    6. Convert string columns to Title Case.
    7. Count and remove exact duplicate rows.
    8. Return cleaned DataFrame and a metrics summary dictionary.
    """
    original_rows = len(df)
    
    # 1. Standardize column names
    df = df.copy()
    df.columns = [standardize_column_name(col) for col in df.columns]
    
    # Trim whitespace across string columns
    for col in df.columns:
        if df[col].dtype == 'object' or isinstance(df[col].dtype, pd.StringDtype):
            df[col] = df[col].astype(str).str.strip()
            # Convert empty strings or whitespace-only to NaN for uniform handling
            df[col] = df[col].replace(r'^\s*$', np.nan, regex=True)

    # 2. Count and drop completely empty rows
    all_nan_rows = df.isna().all(axis=1).sum()
    df = df.dropna(how='all')

    # 3. Count missing values across remaining data
    missing_values_filled = int(df.isna().sum().sum())

    # 4. Fill missing values with "Unknown"
    df = df.fillna("Unknown")

    # 5. Convert string text values to Title Case
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].apply(
                lambda x: x.title() if isinstance(x, str) and x.lower() != 'unknown' and not x.startswith('http') else x
            )

    # 6. Count and drop duplicate rows
    duplicates_removed = int(df.duplicated().sum())
    df = df.drop_duplicates().reset_index(drop=True)

    cleaned_rows = len(df)

    metrics = {
        "original_rows": original_rows,
        "cleaned_rows": cleaned_rows,
        "duplicates_removed": duplicates_removed,
        "missing_values_filled": missing_values_filled,
        "empty_rows_dropped": int(all_nan_rows),
        "columns_count": len(df.columns),
        "column_names": list(df.columns)
    }

    return df, metrics
