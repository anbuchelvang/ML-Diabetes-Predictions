import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Activity, Heart, PieChart as PieChartIcon, 
  BarChart2, TrendingUp, AlertCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid 
} from 'recharts';
import { apiRequest } from '../services/api';

const COLORS = ['#10b981', '#f43f5e'];

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await apiRequest('/dashboard', 'GET');
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-teal-400" /> Analytics & Risk Dashboard
          </h1>
          <p className="text-xs text-slate-400">Aggregated clinical risk statistics & demographic distributions</p>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-teal-500">
          <span className="text-xs text-slate-400 font-medium">Total Predictions</span>
          <div className="text-2xl font-black text-white mt-1">{data.total_predictions}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <span className="text-xs text-slate-400 font-medium">Low Risk Count</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{data.low_risk_count}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-500">
          <span className="text-xs text-slate-400 font-medium">High Risk Count</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{data.high_risk_count}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-500">
          <span className="text-xs text-slate-400 font-medium">Avg Glucose</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{data.avg_glucose} <span className="text-xs font-normal">mg/dL</span></div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-400 font-medium">Avg BMI</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{data.avg_bmi}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Risk Distribution Pie Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-teal-400" /> Overall Risk Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.risk_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Glucose Distribution Bar Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Fasting Glucose Categories
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.glucose_distribution}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BMI Distribution */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> BMI Range Breakdown
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.bmi_distribution}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Assessment Probability Trends
          </h3>
          <div className="h-64 w-full">
            {data.timeline && data.timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} unit="%" />
                  <Tooltip />
                  <Line type="monotone" dataKey="probability" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Perform predictions to populate timeline graphs.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
