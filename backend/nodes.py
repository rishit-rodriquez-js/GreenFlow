"""
GreenFlow ETL - LangGraph Node Definitions.
Each node has a single responsibility and is decorated for LangSmith tracing.
"""

import os
import sys
import io
import time
import pandas as pd
from typing import TypedDict, Dict, Any, List, Optional

# Ensure backend directory is in sys.path for Render & local execution
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Guarantee LangSmith Environment Settings
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "GreenFlow-ETL"

langsmith_key = os.getenv("LANGCHAIN_API_KEY") or os.getenv("LANGSMITH_API_KEY")

if langsmith_key:
    os.environ["LANGCHAIN_API_KEY"] = str(langsmith_key)
    os.environ["LANGSMITH_API_KEY"] = str(langsmith_key)


from langsmith import traceable
from utils import clean_dataframe



class PipelineState(TypedDict):
    """LangGraph State representation across Extract -> Transform -> Load."""
    job_id: str
    filename: str
    raw_csv_bytes: bytes
    raw_df_dict: Optional[List[Dict[str, Any]]]
    cleaned_df_dict: Optional[List[Dict[str, Any]]]
    cleaned_csv_str: str
    metrics: Dict[str, Any]
    node_logs: List[Dict[str, Any]]
    current_node: str
    status: str
    error: Optional[str]


@traceable(name="Extract Node", run_type="tool")
def extract_node(state: PipelineState) -> PipelineState:
    """
    Extract Node: Reads raw CSV byte stream and converts it into a pandas DataFrame.
    """
    start_time = time.time()
    node_name = "Extract Node"
    logs = list(state.get("node_logs", []))

    try:
        raw_bytes = state.get("raw_csv_bytes", b"")
        csv_file = io.BytesIO(raw_bytes)
        df = pd.read_csv(csv_file)

        raw_df_dict = df.to_dict(orient="records")
        execution_time = round(time.time() - start_time, 4)

        log_entry = {
            "node": node_name,
            "order": len(logs) + 1,
            "status": "Success",
            "execution_time_seconds": execution_time,
            "inputs": {"filename": state.get("filename"), "byte_size": len(raw_bytes)},
            "outputs": {"total_rows_extracted": len(df), "columns_found": list(df.columns)}
        }
        logs.append(log_entry)

        return {
            **state,
            "raw_df_dict": raw_df_dict,
            "node_logs": logs,
            "current_node": "Extract",
            "status": "Extracted"
        }

    except Exception as e:
        execution_time = round(time.time() - start_time, 4)
        log_entry = {
            "node": node_name,
            "order": len(logs) + 1,
            "status": "Failed",
            "execution_time_seconds": execution_time,
            "error": str(e)
        }
        logs.append(log_entry)
        return {
            **state,
            "node_logs": logs,
            "current_node": "Extract",
            "status": "Error",
            "error": f"Extract Node Error: {str(e)}"
        }


@traceable(name="Transform Node", run_type="tool")
def transform_node(state: PipelineState) -> PipelineState:
    """
    Transform Node: Standardizes column names, trims whitespace, converts to Title Case,
    removes duplicates, removes empty rows, fills missing with 'Unknown', and calculates metrics.
    """
    start_time = time.time()
    node_name = "Transform Node"
    logs = list(state.get("node_logs", []))

    try:
        raw_df_dict = state.get("raw_df_dict", [])
        df = pd.DataFrame(raw_df_dict)

        cleaned_df, metrics = clean_dataframe(df)
        cleaned_df_dict = cleaned_df.to_dict(orient="records")
        execution_time = round(time.time() - start_time, 4)

        log_entry = {
            "node": node_name,
            "order": len(logs) + 1,
            "status": "Success",
            "execution_time_seconds": execution_time,
            "inputs": {"input_rows": len(raw_df_dict)},
            "outputs": metrics
        }
        logs.append(log_entry)

        return {
            **state,
            "cleaned_df_dict": cleaned_df_dict,
            "metrics": metrics,
            "node_logs": logs,
            "current_node": "Transform",
            "status": "Transformed"
        }

    except Exception as e:
        execution_time = round(time.time() - start_time, 4)
        log_entry = {
            "node": node_name,
            "order": len(logs) + 1,
            "status": "Failed",
            "execution_time_seconds": execution_time,
            "error": str(e)
        }
        logs.append(log_entry)
        return {
            **state,
            "node_logs": logs,
            "current_node": "Transform",
            "status": "Error",
            "error": f"Transform Node Error: {str(e)}"
        }


@traceable(name="Load Node", run_type="tool")
def load_node(state: PipelineState) -> PipelineState:
    """
    Load Node: Serializes cleaned DataFrame to CSV string and prepares downloadable payload.
    """
    start_time = time.time()
    node_name = "Load Node"
    logs = list(state.get("node_logs", []))

    try:
        cleaned_df_dict = state.get("cleaned_df_dict", [])
        df = pd.DataFrame(cleaned_df_dict)

        output_buffer = io.StringIO()
        df.to_csv(output_buffer, index=False)
        cleaned_csv_str = output_buffer.getvalue()

        execution_time = round(time.time() - start_time, 4)

        log_entry = {
            "node": node_name,
            "order": len(logs) + 1,
            "status": "Success",
            "execution_time_seconds": execution_time,
            "inputs": {"cleaned_rows_count": len(df)},
            "outputs": {"csv_string_length": len(cleaned_csv_str), "preview_rows": min(10, len(df))}
        }
        logs.append(log_entry)

        return {
            **state,
            "cleaned_csv_str": cleaned_csv_str,
            "node_logs": logs,
            "current_node": "Load",
            "status": "Completed"
        }

    except Exception as e:
        execution_time = round(time.time() - start_time, 4)
        log_entry = {
            "node": node_name,
            "order": len(logs) + 1,
            "status": "Failed",
            "execution_time_seconds": execution_time,
            "error": str(e)
        }
        logs.append(log_entry)
        return {
            **state,
            "node_logs": logs,
            "current_node": "Load",
            "status": "Error",
            "error": f"Load Node Error: {str(e)}"
        }
