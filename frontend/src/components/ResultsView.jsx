import React from 'react';
import MetricsGrid from './MetricsGrid';
import CsvTable from './CsvTable';
import { Download, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react';

export default function ResultsView({ metrics, rawData, cleanedData, onDownload, onReset, filename }) {
  return (
    <div class="max-w-6xl mx-auto px-4 py-8">
      {/* Title & Success Banner */}
      <div class="bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 rounded-3xl p-6 sm:p-8 text-white shadow-glow-green mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>ETL Pipeline Completed Successfully</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Data Cleaning Complete</h1>
          <p class="text-white/80 text-xs sm:text-sm mt-1">
            Processed file: <span class="font-bold underline text-white">{filename}</span> via LangGraph workflow
          </p>
        </div>

        {/* Action Buttons in Banner */}
        <div class="flex items-center space-x-3 w-full md:w-auto">
          <button
            type="button"
            onClick={onReset}
            class="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold transition-all border border-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span>Upload Another File</span>
          </button>

          <button
            type="button"
            onClick={onDownload}
            class="flex-1 md:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-lg hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2 text-neon-lime" />
            <span>Download Cleaned CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid metrics={metrics} />

      {/* Interactive CSV Preview Table */}
      <CsvTable rawData={rawData} cleanedData={cleanedData} />

      {/* Bottom Action Footer */}
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <h4 class="font-bold text-dark-text text-sm">Need further analysis?</h4>
          <p class="text-xs text-slate-500">Your cleaned data contains standardized snake_case columns and title-cased fields.</p>
        </div>

        <div class="flex items-center space-x-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onReset}
            class="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
          >
            Upload Another File
          </button>
          <button
            type="button"
            onClick={onDownload}
            class="w-full sm:w-auto px-5 py-2 rounded-xl bg-green-primary text-white text-xs font-bold hover:bg-green-600 shadow-glow-green"
          >
            Download Cleaned CSV
          </button>
        </div>
      </div>
    </div>
  );
}
