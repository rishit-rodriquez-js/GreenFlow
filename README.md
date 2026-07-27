# GreenFlow ETL – A Visual Data Cleaning Pipeline using LangGraph

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.0.30-orange.svg)](https://langchain-ai.github.io/langgraph/)
[![LangSmith](https://img.shields.io/badge/LangSmith-Enabled-yellow.svg)](https://smith.langchain.com/)

**GreenFlow ETL** is a production-ready visual data cleaning engine built with **React**, **Vite**, **Tailwind CSS**, **FastAPI**, **Pandas**, and **LangGraph**. It automates data cleaning through a transparent, multi-node workflow while logging end-to-end execution traces directly to **LangSmith**.

---

## 📌 Project Overview

Traditional data cleaning scripts are opaque and difficult to trace. GreenFlow breaks down data cleaning into a modular, single-responsibility **LangGraph linear pipeline**:

1. **Extract Node**: Ingests raw CSV byte streams into isolated state objects.
2. **Transform Node**: Standardizes column headers to `snake_case`, strips leading/trailing whitespace, converts text fields to Title Case, purges duplicate records, imputes missing values with `"Unknown"`, and calculates metric summaries.
3. **Load Node**: Serializes cleaned DataFrames back into CSV format, enabling instant browser preview and download.

---

## ✨ Features

- 🎨 **Modern Minimalist UI**: Built with a curated color system (Primary Green `#22C55E`, Pale Orange `#FDBA74`, Neon Lime `#A3E635`, Soft Cream `#FFF7ED`, Dark Text `#1F2937`).
- ⚡ **Real-Time Progress Tracking**: Workflow progress cards dynamically animate through `Pending` → `Processing` → `Completed`.
- 📊 **Metrics Summary Dashboard**: Instant visibility into Original Rows, Cleaned Rows, Duplicates Removed, and Missing Values Imputed.
- 🔍 **Side-by-Side Data Preview**: Interactive tabbed view for original raw data vs. cleaned output table.
- 📡 **LangSmith Observability**: Complete tracing for node execution order, runtime latency, inputs, outputs, and success status.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Frontend (React + Vite + Tailwind CSS)"]
        UI[Upload UI] -->|1. POST CSV File| API_Upload[FastAPI Upload Endpoint]
        Progress[Progress View] <--|2. Poll Status| API_Status[FastAPI Status Endpoint]
        Results[Results View] -->|3. GET Cleaned CSV| API_Download[FastAPI Download Endpoint]
    end

    subgraph Backend ["Backend (FastAPI + LangGraph + Pandas)"]
        API_Upload --> GraphRunner[LangGraph StateGraph Runner]
        
        subgraph LangGraphWorkflow ["LangGraph Linear Pipeline"]
            START((START)) --> Extract[Extract Node]
            Extract -->|Raw DF + State| Transform[Transform Node]
            Transform -->|Cleaned DF + Summary| Load[Load Node]
            Load --> END((END))
        end
        
        GraphRunner --> LangGraphWorkflow
        LangGraphWorkflow -.->|Log Traces| LangSmith[LangSmith Tracing Platform]
        Load -->|CSV Stream| API_Download
    end
```

---

## 🔄 Workflow Diagram

```
START
  │
  ▼
[ Extract Node ]  --> Read CSV & store raw DataFrame
  │
  ▼
[ Transform Node ] --> Strip whitespace, standardize columns, title case text, drop duplicates, fill NaNs with "Unknown"
  │
  ▼
[ Load Node ]      --> Serialize cleaned DataFrame to CSV & generate preview
  │
  ▼
 END
```

---

## 📂 Folder Structure

```
GreenFlow/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.jsx
│       └── components/
│           ├── Header.jsx
│           ├── FileUpload.jsx
│           ├── ProgressCard.jsx
│           ├── ProcessingView.jsx
│           ├── MetricsGrid.jsx
│           ├── CsvTable.jsx
│           └── ResultsView.jsx
├── backend/
│   ├── app.py
│   ├── graph.py
│   ├── nodes.py
│   ├── utils.py
│   └── requirements.txt
├── samples/
│   └── sample_input.csv
├── images/
├── README.md
├── LICENSE
├── vercel.json
└── render.yaml
```

---

## 🔑 Environment Variables

Create a `.env` file inside `backend/`:

```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
LANGCHAIN_PROJECT=GreenFlow-ETL
LANGSMITH_API_KEY=your_langsmith_api_key_here
```

---

## 💻 Local Installation & Setup (PowerShell)

Execute the following PowerShell commands to run GreenFlow locally:

```powershell
# 1. Clone repository
git clone https://github.com/rishit-rodriquez-js/GreenFlow.git
cd GreenFlow

# 2. Setup & Run Backend (Terminal 1)
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

# 3. Setup & Run Frontend (Terminal 2)
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🖼 Screenshots

*Upload Screen*
![Upload Placeholder](images/upload_preview.png)

*Processing Workflow*
![Workflow Placeholder](images/workflow_preview.png)

*Results & Preview*
![Results Placeholder](images/results_preview.png)

---

## 🚀 Deployment Instructions

### Frontend on Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in root or import your GitHub repository (`rishit-rodriquez-js/GreenFlow`) into Vercel Dashboard.
3. Set **Framework Preset** to Vite and **Root Directory** to `frontend`.

### Backend on Render / Railway
1. Connect repository `rishit-rodriquez-js/GreenFlow` to Render or Railway.
2. Build Command: `pip install -r backend/requirements.txt`
3. Start Command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
4. Add environment variable `LANGSMITH_API_KEY`.

---

## 🧪 LangSmith Tracing Verification

1. Go to [smith.langchain.com](https://smith.langchain.com/).
2. Select project **GreenFlow-ETL**.
3. View step-by-step node execution traces:
   - **Extract Node**: Inputs byte size, outputs row count.
   - **Transform Node**: Inputs raw rows, outputs metric counts.
   - **Load Node**: Inputs cleaned rows, outputs final CSV length.

---

## 🔮 Future Improvements

- 🛠 Custom Cleaning Rules (Regex filters, column selection).
- 📈 Data Quality Score Indicator.
- 💾 PostgreSQL / Snowflake database load connectors.
- ⚡ WebSockets for live progress streaming.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
