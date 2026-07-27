import React from 'react';
import { Database, Sparkles, Activity } from 'lucide-react';

export default function Header() {
  return (
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and App Title */}
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-primary to-neon-lime flex items-center justify-center shadow-glow-green text-white font-bold">
            <Database className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-xl font-extrabold tracking-tight text-dark-text">GreenFlow</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-soft-cream border border-pale-orange text-amber-800">
                ETL Pipeline
              </span>
            </div>
            <p class="text-xs text-slate-500 hidden sm:block">Visual Data Cleaning powered by LangGraph</p>
          </div>
        </div>

        {/* Status badges */}
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
            <Activity className="w-4 h-4 text-green-primary animate-pulse" />
            <span class="font-medium hidden md:inline">LangGraph Workflow</span>
            <span class="inline-block w-2 h-2 rounded-full bg-green-primary"></span>
          </div>

          <div class="flex items-center space-x-1 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-lg border border-pale-orange text-xs text-amber-900 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>LangSmith Traced</span>
          </div>
        </div>
      </div>
    </header>
  );
}
