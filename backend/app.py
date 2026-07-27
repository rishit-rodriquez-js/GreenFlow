"""
GreenFlow ETL - FastAPI Server.
Exposes REST APIs for CSV upload, execution, status tracking, preview, and download.
"""

import os
import uuid
from typing import Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, FileResponse, JSONResponse
from dotenv import load_dotenv

from .graph import etl_pipeline
from nodes import PipelineState

load_dotenv()

# Configure LangSmith Tracing Environment Variables
os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2", "true")
os.environ["LANGCHAIN_ENDPOINT"] = os.getenv("LANGCHAIN_ENDPOINT", "https://api.smith.langchain.com")
os.environ["LANGCHAIN_PROJECT"] = os.getenv("LANGCHAIN_PROJECT", "GreenFlow-ETL")
if "LANGCHAIN_API_KEY" not in os.environ and os.getenv("LANGSMITH_API_KEY"):
    os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGSMITH_API_KEY", "")

app = FastAPI(
    title="GreenFlow ETL API",
    description="A Visual Data Cleaning Pipeline REST Service using LangGraph & Pandas",
    version="1.0.0"
)

# Enable CORS for Frontend Development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for active jobs (in production, use Redis or Postgres)
JOBS_DB: Dict[str, Dict[str, Any]] = {}


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "GreenFlow ETL Engine",
        "version": "1.0.0",
        "langsmith_tracing": os.getenv("LANGCHAIN_TRACING_V2", "true") == "true"
    }


@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    """
    Uploads a raw CSV file and initializes an ETL job session.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV files are supported.")

    content = await file.read()
    if not content or len(content.strip()) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    job_id = str(uuid.uuid4())

    initial_state: PipelineState = {
        "job_id": job_id,
        "filename": file.filename,
        "raw_csv_bytes": content,
        "raw_df_dict": None,
        "cleaned_df_dict": None,
        "cleaned_csv_str": "",
        "metrics": {},
        "node_logs": [],
        "current_node": "Pending",
        "status": "Initialized",
        "error": None
    }

    JOBS_DB[job_id] = initial_state

    return {
        "job_id": job_id,
        "filename": file.filename,
        "size_bytes": len(content),
        "status": "Initialized",
        "message": "File uploaded successfully. Ready for processing."
    }


def run_pipeline_task(job_id: str):
    """Background execution runner for LangGraph pipeline."""
    if job_id not in JOBS_DB:
        return
    
    state = JOBS_DB[job_id]
    try:
        final_state = etl_pipeline.invoke(state)
        JOBS_DB[job_id] = final_state
    except Exception as e:
        state["status"] = "Error"
        state["error"] = str(e)
        JOBS_DB[job_id] = state


@app.post("/api/process/{job_id}")
async def process_csv(job_id: str, background_tasks: BackgroundTasks):
    """
    Triggers the LangGraph linear workflow (Extract -> Transform -> Load).
    """
    if job_id not in JOBS_DB:
        raise HTTPException(status_code=404, detail="Job session not found.")

    state = JOBS_DB[job_id]
    
    # Run synchronously or async via thread
    final_state = etl_pipeline.invoke(state)
    JOBS_DB[job_id] = final_state

    return {
        "job_id": job_id,
        "status": final_state["status"],
        "metrics": final_state.get("metrics", {}),
        "node_logs": final_state.get("node_logs", []),
        "error": final_state.get("error")
    }


@app.get("/api/status/{job_id}")
async def get_job_status(job_id: str):
    """
    Returns current job state, node execution logs, and cleaning metrics.
    """
    if job_id not in JOBS_DB:
        raise HTTPException(status_code=404, detail="Job session not found.")

    state = JOBS_DB[job_id]
    return {
        "job_id": job_id,
        "filename": state.get("filename"),
        "status": state.get("status"),
        "current_node": state.get("current_node"),
        "metrics": state.get("metrics", {}),
        "node_logs": state.get("node_logs", []),
        "error": state.get("error")
    }


@app.get("/api/preview/{job_id}")
async def get_preview(job_id: str):
    """
    Returns original and cleaned preview tables (first 50 records).
    """
    if job_id not in JOBS_DB:
        raise HTTPException(status_code=404, detail="Job session not found.")

    state = JOBS_DB[job_id]
    raw_df_dict = state.get("raw_df_dict") or []
    cleaned_df_dict = state.get("cleaned_df_dict") or []

    return {
        "job_id": job_id,
        "raw_preview": raw_df_dict[:50],
        "cleaned_preview": cleaned_df_dict[:50],
        "metrics": state.get("metrics", {})
    }


@app.get("/api/download/{job_id}")
async def download_cleaned_csv(job_id: str):
    """
    Downloads the cleaned CSV file output.
    """
    if job_id not in JOBS_DB:
        raise HTTPException(status_code=404, detail="Job session not found.")

    state = JOBS_DB[job_id]
    csv_content = state.get("cleaned_csv_str", "")

    if not csv_content:
        raise HTTPException(status_code=400, detail="Cleaned CSV not ready or processing failed.")

    original_filename = state.get("filename", "dataset.csv")
    base_name = original_filename.rsplit(".", 1)[0]
    download_filename = f"{base_name}_cleaned_greenflow.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={download_filename}"
        }
    )


@app.get("/api/sample-csv")
async def get_sample_csv():
    """
    Returns a sample messy CSV file for testing.
    """
    sample_path = os.path.join(os.path.dirname(__file__), "..", "samples", "sample_input.csv")
    if os.path.exists(sample_path):
        return FileResponse(sample_path, media_type="text/csv", filename="sample_input.csv")

    fallback_csv = (
        " FULL NAME , Email Address ,AGE, City , DEPARTMENT , SALARY \n"
        " john doe , john.doe@example.com , 29 , new york , engineering , 85000 \n"
        " jane SMITH , jane.smith@example.com , 34 , LOS ANGELES , marketing , 92000 \n"
        " john doe , john.doe@example.com , 29 , new york , engineering , 85000 \n"
        " ALICE BROWN ,  , 42 , CHICAGO , sales , 78000 \n"
    )
    return Response(content=fallback_csv, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=sample_input.csv"})
