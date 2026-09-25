import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { HelpCircle } from 'lucide-react';

export default function ExplainableAIChart({ featureContributions = [] }) {
  if (!featureContributions || featureContributions.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400 text-xs">
        No feature impact data available.
      </div>
    );
  }

  // Format data for Recharts horizontal bar chart
  const data = featureContributions.map((item) => ({
    name: item.feature,
    percentage: item.relative_percentage || Math.round(item.abs_impact * 100),
    impactLabel: item.impact_label,
    userVal: item.user_value,
    direction: item.direction,
    isIncreasingRisk: item.direction === "Increasing Risk"
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-bold text-teal-300">{d.name}</p>
          <p className="text-slate-300">Your Value: <span className="text-white font-mono">{d.userVal}</span></p>
          <p className="text-slate-300">Impact Score: <span className="text-white font-mono">{d.percentage}%</span></p>
          <p className={`font-semibold ${d.isIncreasingRisk ? 'text-rose-400' : 'text-emerald-400'}`}>
            {d.impactLabel} ({d.direction})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            Explainable AI (XAI) - Factor Impact Analysis
          </h4>
          <p className="text-xs text-slate-400">
            Shows which health measurements contributed most strongly to this prediction.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> High Risk Factors
          </span>
          <span className="flex items-center gap-1 text-emerald-400 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Protective/Low
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <XAxis type="number" unit="%" domain={[0, 'dataMax + 10']} stroke="#64748b" fontSize={11} />
            <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isIncreasingRisk ? '#f43f5e' : '#10b981'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
