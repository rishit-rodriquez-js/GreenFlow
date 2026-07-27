import React, { useState } from 'react';
import { Table, Eye, FileSpreadsheet } from 'lucide-react';

export default function CsvTable({ rawData, cleanedData }) {
  const [activeTab, setActiveTab] = useState('cleaned'); // 'cleaned' | 'raw'

  const currentData = activeTab === 'cleaned' ? cleanedData : rawData;
  const headers = currentData && currentData.length > 0 ? Object.keys(currentData[0]) : [];

  return (
    <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Header and Tab Toggle */}
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <h3 class="font-bold text-dark-text text-base">CSV Data Preview</h3>
          <span class="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
            First {currentData.length} Rows
          </span>
        </div>

        {/* Tab Buttons */}
        <div class="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('cleaned')}
            class={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'cleaned'
                ? 'bg-white text-green-700 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cleaned Output ({cleanedData?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            class={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'raw'
                ? 'bg-white text-dark-text shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Original Input ({rawData?.length || 0})
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div class="overflow-x-auto max-h-[420px]">
        {headers.length === 0 ? (
          <div class="p-8 text-center text-slate-400 text-sm">No data available for preview.</div>
        ) : (
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-slate-100/80 sticky top-0 z-10 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th class="p-3 w-12 text-center text-slate-400 font-mono border-r border-slate-200">#</th>
                {headers.map((header) => (
                  <th key={header} class="p-3 whitespace-nowrap font-bold uppercase tracking-wider text-[11px] border-r border-slate-200">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono text-[12px] text-slate-700">
              {currentData.map((row, idx) => (
                <tr key={idx} class="hover:bg-emerald-50/30 transition-colors">
                  <td class="p-3 text-center text-slate-400 font-mono bg-slate-50/50 border-r border-slate-200">
                    {idx + 1}
                  </td>
                  {headers.map((header) => {
                    const value = row[header];
                    const isUnknown = value === 'Unknown';

                    return (
                      <td
                        key={header}
                        class={`p-3 whitespace-nowrap border-r border-slate-100 ${
                          isUnknown ? 'text-amber-600 font-semibold bg-amber-50/30' : ''
                        }`}
                      >
                        {String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
