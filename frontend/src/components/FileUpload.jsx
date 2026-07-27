import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function FileUpload({ onFileUpload, onSampleLoad }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelectFile = (file) => {
    setError('');
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a valid .csv file.');
      setSelectedFile(null);
      return;
    }

    if (file.size === 0) {
      setError('Selected file is empty.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleProceed = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div class="max-w-3xl mx-auto px-4 py-8">
      {/* Title Card */}
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-dark-text tracking-tight sm:text-4xl mb-3">
          Clean Messy Data with <span class="bg-gradient-to-r from-green-600 via-green-500 to-lime-500 bg-clip-text text-transparent">LangGraph</span>
        </h1>
        <p class="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Upload your CSV file to extract, transform, and load clean data automatically with multi-node validation and LangSmith observability.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        class={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-green-primary bg-green-50/50 shadow-glow-green scale-[1.01]'
            : selectedFile
            ? 'border-green-primary bg-emerald-50/20'
            : 'border-slate-300 bg-white hover:border-green-primary/60 hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          class="hidden"
        />

        {!selectedFile ? (
          <div class="flex flex-col items-center justify-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-soft-cream border border-pale-orange flex items-center justify-center text-green-primary shadow-sm">
              <UploadCloud className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p class="text-base font-semibold text-dark-text">
                Drag and drop your CSV file here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  class="text-green-600 font-bold hover:underline focus:outline-none"
                >
                  browse files
                </button>
              </p>
              <p class="text-xs text-slate-400 mt-1">Supports standard .csv files up to 20MB</p>
            </div>
          </div>
        ) : (
          <div class="flex flex-col items-center justify-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-700">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div class="flex items-center space-x-2 justify-center">
                <span class="font-bold text-dark-text text-base">{selectedFile.name}</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <p class="text-xs text-slate-500 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for LangGraph ETL Workflow
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              class="text-xs text-slate-400 hover:text-red-500 underline"
            >
              Choose a different file
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div class="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center space-x-2 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Quick sample loader */}
        <button
          type="button"
          onClick={onSampleLoad}
          class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-pale-orange bg-soft-cream text-amber-900 font-medium text-xs hover:bg-amber-100/60 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-600 mr-2" />
          <span>Use Sample Messy CSV</span>
        </button>

        {/* Start Pipeline button */}
        <button
          type="button"
          disabled={!selectedFile}
          onClick={handleProceed}
          class={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
            selectedFile
              ? 'bg-gradient-to-r from-green-primary to-emerald-600 text-white shadow-glow-green hover:shadow-lg hover:scale-[1.02] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Run GreenFlow ETL</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Features summary footer */}
      <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200">
        <div class="p-4 rounded-xl bg-white border border-slate-100 shadow-sm text-center">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-green-600 mx-auto flex items-center justify-center font-bold text-xs mb-2">1</div>
          <h4 class="font-bold text-xs text-dark-text">Extract Node</h4>
          <p class="text-[11px] text-slate-500 mt-1">Reads & parses CSV byte streams cleanly into state</p>
        </div>
        <div class="p-4 rounded-xl bg-white border border-slate-100 shadow-sm text-center">
          <div class="w-8 h-8 rounded-lg bg-orange-50 text-amber-600 mx-auto flex items-center justify-center font-bold text-xs mb-2">2</div>
          <h4 class="font-bold text-xs text-dark-text">Transform Node</h4>
          <p class="text-[11px] text-slate-500 mt-1">Strips spaces, fills NaNs, removes duplicates & formats text</p>
        </div>
        <div class="p-4 rounded-xl bg-white border border-slate-100 shadow-sm text-center">
          <div class="w-8 h-8 rounded-lg bg-lime-50 text-lime-700 mx-auto flex items-center justify-center font-bold text-xs mb-2">3</div>
          <h4 class="font-bold text-xs text-dark-text">Load Node</h4>
          <p class="text-[11px] text-slate-500 mt-1">Serializes cleaned payload for instant preview & download</p>
        </div>
      </div>
    </div>
  );
}
