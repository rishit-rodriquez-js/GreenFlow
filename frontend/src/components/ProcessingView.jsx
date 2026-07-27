import React from 'react';
import ProgressCard from './ProgressCard';
import { ArrowDown, Cpu } from 'lucide-react';

export default function ProcessingView({ nodeStates, nodeLogs, filename }) {
  // nodeStates: { extract: "Completed", transform: "Processing", load: "Pending" }

  const calculateOverallProgress = () => {
    let completedCount = 0;
    if (nodeStates.extract === 'Completed') completedCount++;
    if (nodeStates.transform === 'Completed') completedCount++;
    if (nodeStates.load === 'Completed') completedCount++;
    return Math.round((completedCount / 3) * 100);
  };

  const getLogForNode = (nodeName) => {
    return nodeLogs.find(log => log.node === nodeName);
  };

  return (
    <div class="max-w-3xl mx-auto px-4 py-8">
      {/* Processing Header */}
      <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 text-center">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-500 to-neon-lime text-slate-900 mx-auto flex items-center justify-center shadow-glow-green mb-3">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
        <h2 class="text-xl font-extrabold text-dark-text">Processing Pipeline Active</h2>
        <p class="text-xs text-slate-500 mt-1">
          Executing LangGraph nodes sequentially for <span class="font-bold text-slate-700">{filename}</span>
        </p>

        {/* Progress Bar */}
        <div class="mt-6">
          <div class="flex justify-between text-xs text-slate-500 font-semibold mb-2">
            <span>ETL Progress</span>
            <span class="text-green-600 font-bold">{calculateOverallProgress()}%</span>
          </div>
          <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              class="h-full bg-gradient-to-r from-green-primary via-emerald-400 to-neon-lime rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Nodes Stack */}
      <div class="space-y-4">
        {/* Node 1: Extract */}
        <ProgressCard
          stepNumber="1"
          title="Extract Node"
          description="Read CSV byte stream and store pandas DataFrame state"
          status={nodeStates.extract}
          logData={getLogForNode('Extract Node')}
        />

        <div class="flex justify-center my-1">
          <ArrowDown className="w-5 h-5 text-slate-300 animate-bounce" />
        </div>

        {/* Node 2: Transform */}
        <ProgressCard
          stepNumber="2"
          title="Transform Node"
          description="Standardize column names, trim spaces, title case, remove duplicates & NaNs"
          status={nodeStates.transform}
          logData={getLogForNode('Transform Node')}
        />

        <div class="flex justify-center my-1">
          <ArrowDown className="w-5 h-5 text-slate-300 animate-bounce" />
        </div>

        {/* Node 3: Load */}
        <ProgressCard
          stepNumber="3"
          title="Load Node"
          description="Serialize cleaned DataFrame to CSV and prepare preview & download"
          status={nodeStates.load}
          logData={getLogForNode('Load Node')}
        />
      </div>
    </div>
  );
}
