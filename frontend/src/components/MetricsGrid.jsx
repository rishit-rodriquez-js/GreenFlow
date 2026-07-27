import React from 'react';
import { Database, CheckCircle2, Copy, Sparkles } from 'lucide-react';

export default function MetricsGrid({ metrics }) {
  const {
    original_rows = 0,
    cleaned_rows = 0,
    duplicates_removed = 0,
    missing_values_filled = 0
  } = metrics || {};

  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Original Rows Card */}
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Rows</span>
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-extrabold text-dark-text mt-3">{original_rows}</p>
        <p class="text-[11px] text-slate-400 mt-1">Raw input dataset count</p>
      </div>

      {/* Cleaned Rows Card */}
      <div class="bg-white border border-green-200 rounded-2xl p-5 shadow-sm hover:shadow-glow-green transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-green-700 uppercase tracking-wider">Cleaned Rows</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-100 text-green-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-extrabold text-green-600 mt-3">{cleaned_rows}</p>
        <p class="text-[11px] text-green-700/70 mt-1">Ready for analytics</p>
      </div>

      {/* Duplicates Removed Card */}
      <div class="bg-white border border-orange-200 rounded-2xl p-5 shadow-sm hover:shadow-glow-orange transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-amber-800 uppercase tracking-wider">Duplicates Removed</span>
          <div class="w-8 h-8 rounded-lg bg-soft-cream border border-pale-orange text-amber-700 flex items-center justify-center">
            <Copy className="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-3">{duplicates_removed}</p>
        <p class="text-[11px] text-amber-700/70 mt-1">Identical rows purged</p>
      </div>

      {/* Missing Values Filled Card */}
      <div class="bg-white border border-lime-200 rounded-2xl p-5 shadow-sm hover:shadow-glow-lime transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-lime-800 uppercase tracking-wider">Missing Filled</span>
          <div class="w-8 h-8 rounded-lg bg-lime-100 text-lime-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <p class="text-2xl sm:text-3xl font-extrabold text-lime-700 mt-3">{missing_values_filled}</p>
        <p class="text-[11px] text-lime-700/70 mt-1">Imputed with "Unknown"</p>
      </div>
    </div>
  );
}
