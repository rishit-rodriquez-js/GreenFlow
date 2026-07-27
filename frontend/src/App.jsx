import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import ResultsView from './components/ResultsView';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// API Base URL - default to empty string for relative proxying in dev, or custom env
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [viewState, setViewState] = useState('upload'); // 'upload' | 'processing' | 'results' | 'error'
  const [jobId, setJobId] = useState(null);
  const [filename, setFilename] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Node progress tracking
  const [nodeStates, setNodeStates] = useState({
    extract: 'Pending',
    transform: 'Pending',
    load: 'Pending',
  });
  const [nodeLogs, setNodeLogs] = useState([]);

  // Results data
  const [metrics, setMetrics] = useState({});
  const [rawData, setRawData] = useState([]);
  const [cleanedData, setCleanedData] = useState([]);

  // Handles CSV File Upload & Triggering Pipeline
  const handleFileUpload = async (file) => {
    try {
      setViewState('processing');
      setErrorMsg('');
      setFilename(file.name);
      setNodeStates({ extract: 'Processing', transform: 'Pending', load: 'Pending' });

      // 1. Upload File
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.detail || 'Failed to upload CSV file.');
      }

      const uploadData = await uploadRes.json();
      const currentJobId = uploadData.job_id;
      setJobId(currentJobId);

      // Simulate node transition visuals while backend processes
      setTimeout(() => {
        setNodeStates({ extract: 'Completed', transform: 'Processing', load: 'Pending' });
      }, 600);

      // 2. Trigger Pipeline Process
      const processRes = await fetch(`${API_BASE}/api/process/${currentJobId}`, {
        method: 'POST',
      });

      if (!processRes.ok) {
        const errData = await processRes.json();
        throw new Error(errData.detail || 'Error executing ETL pipeline.');
      }

      const processData = await processRes.json();

      setNodeStates({ extract: 'Completed', transform: 'Completed', load: 'Processing' });
      setNodeLogs(processData.node_logs || []);

      // 3. Fetch Preview Data
      const previewRes = await fetch(`${API_BASE}/api/preview/${currentJobId}`);
      const previewData = await previewRes.json();

      setMetrics(processData.metrics || previewData.metrics || {});
      setRawData(previewData.raw_preview || []);
      setCleanedData(previewData.cleaned_preview || []);

      setTimeout(() => {
        setNodeStates({ extract: 'Completed', transform: 'Completed', load: 'Completed' });
        setViewState('results');
      }, 700);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An unexpected error occurred during processing.');
      setViewState('error');
    }
  };

  // Handles loading the sample messy CSV directly
  const handleSampleLoad = async () => {
    try {
      setViewState('processing');
      setErrorMsg('');
      setFilename('sample_input.csv');
      setNodeStates({ extract: 'Processing', transform: 'Pending', load: 'Pending' });

      // Fetch sample CSV blob
      const sampleRes = await fetch(`${API_BASE}/api/sample-csv`);
      const blob = await sampleRes.blob();
      const sampleFile = new File([blob], 'sample_input.csv', { type: 'text/csv' });

      await handleFileUpload(sampleFile);
    } catch (err) {
      setErrorMsg('Failed to load sample CSV file.');
      setViewState('error');
    }
  };

  // Handles CSV download
  const handleDownload = () => {
    if (!jobId) return;
    window.open(`${API_BASE}/api/download/${jobId}`, '_blank');
  };

  // Reset to Upload page
  const handleReset = () => {
    setViewState('upload');
    setJobId(null);
    setFilename('');
    setErrorMsg('');
    setNodeStates({ extract: 'Pending', transform: 'Pending', load: 'Pending' });
    setNodeLogs([]);
    setMetrics({});
    setRawData([]);
    setCleanedData([]);
  };

  return (
    <div class="min-h-screen bg-bg-slate text-dark-text flex flex-col font-sans">
      <Header />

      <main class="flex-1 pb-16">
        {viewState === 'upload' && (
          <FileUpload onFileUpload={handleFileUpload} onSampleLoad={handleSampleLoad} />
        )}

        {viewState === 'processing' && (
          <ProcessingView
            nodeStates={nodeStates}
            nodeLogs={nodeLogs}
            filename={filename}
          />
        )}

        {viewState === 'results' && (
          <ResultsView
            metrics={metrics}
            rawData={rawData}
            cleanedData={cleanedData}
            onDownload={handleDownload}
            onReset={handleReset}
            filename={filename}
          />
        )}

        {viewState === 'error' && (
          <div class="max-w-md mx-auto my-16 p-6 bg-white border border-red-200 rounded-2xl shadow-sm text-center">
            <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-dark-text mb-2">ETL Pipeline Failed</h3>
            <p class="text-xs text-slate-500 mb-6">{errorMsg}</p>
            <button
              type="button"
              onClick={handleReset}
              class="inline-flex items-center px-4 py-2 rounded-xl bg-dark-text text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </main>

      <footer class="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>GreenFlow ETL Engine • Powered by LangGraph, FastAPI, Pandas & React</p>
      </footer>
    </div>
  );
}
