import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertTriangle } from 'lucide-react';

export default function ProgressCard({ stepNumber, title, description, status, logData }) {
  // Status: "Pending" | "Processing" | "Completed" | "Error"

  const getStatusBadge = () => {
    switch (status) {
      case 'Completed':
        return (
          <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>Completed</span>
          </span>
        );
      case 'Processing':
        return (
          <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-pale-orange animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case 'Error':
        return (
          <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const getCardStyle = () => {
    switch (status) {
      case 'Completed':
        return 'border-green-primary bg-white shadow-glow-green';
      case 'Processing':
        return 'border-pale-orange bg-amber-50/40 shadow-glow-orange ring-2 ring-pale-orange/50';
      case 'Error':
        return 'border-red-300 bg-red-50/30';
      default:
        return 'border-slate-200 bg-white opacity-70';
    }
  };

  const getStepNumberBadge = () => {
    switch (status) {
      case 'Completed':
        return 'bg-gradient-to-tr from-green-500 to-neon-lime text-slate-900 font-extrabold';
      case 'Processing':
        return 'bg-pale-orange text-amber-950 font-bold';
      default:
        return 'bg-slate-200 text-slate-600 font-medium';
    }
  };

  return (
    <div class={`relative border rounded-2xl p-5 transition-all duration-300 ${getCardStyle()}`}>
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-3">
          <div class={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-sm ${getStepNumberBadge()}`}>
            {stepNumber}
          </div>
          <div>
            <h3 class="font-bold text-dark-text text-base">{title}</h3>
            <p class="text-xs text-slate-500">{description}</p>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Execution details if available */}
      {logData && (
        <div class="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
          <div class="flex justify-between items-center text-[11px] text-slate-500">
            <span>Execution Time:</span>
            <span class="font-mono font-medium">{logData.execution_time_seconds ?? 0.001}s</span>
          </div>
          {logData.outputs && (
            <div class="text-[11px] text-slate-600 mt-1">
              <span class="font-semibold text-slate-700">Node Output: </span>
              {JSON.stringify(logData.outputs)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
