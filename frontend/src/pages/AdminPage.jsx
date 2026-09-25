import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Activity, BarChart2, Cpu, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await apiRequest('/admin/stats', 'GET');
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load admin statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
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

  const { summary, model_evaluation } = data;
  const metrics = model_evaluation?.metrics || {};
  const cm = metrics?.confusion_matrix || [[0, 0], [0, 0]];
  const importances = model_evaluation?.feature_importances || {};

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" /> Admin Control & ML Model Panel
          </h1>
          <p className="text-xs text-slate-400">Global system metrics & trained classification model benchmarks</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500">
          <span className="text-xs text-slate-400 font-medium">Registered Users</span>
          <div className="text-2xl font-black text-white mt-1">{summary.total_users}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-teal-500">
          <span className="text-xs text-slate-400 font-medium">Total System Predictions</span>
          <div className="text-2xl font-black text-teal-400 mt-1">{summary.total_predictions}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500">
          <span className="text-xs text-slate-400 font-medium">High Risk Predictions</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{summary.high_risk_predictions}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-500">
          <span className="text-xs text-slate-400 font-medium">Low Risk Predictions</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{summary.low_risk_predictions}</div>
        </div>
      </div>

      {/* Model Benchmark Overview */}
      <div className="glass-card p-6 rounded-2xl space-y-6 border border-slate-800">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-teal-400">Deployed Algorithm</span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <Cpu className="w-5 h-5 text-teal-400" /> {model_evaluation?.best_model_name || 'GradientBoosting'} Classifier
            </h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Production Active
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="text-xl font-black text-teal-400 mt-1">{(metrics.accuracy * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Precision</div>
            <div className="text-xl font-black text-cyan-400 mt-1">{(metrics.precision * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Recall</div>
            <div className="text-xl font-black text-emerald-400 mt-1">{(metrics.recall * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">F1-Score</div>
            <div className="text-xl font-black text-amber-400 mt-1">{(metrics.f1_score * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">ROC-AUC</div>
            <div className="text-xl font-black text-rose-400 mt-1">{(metrics.roc_auc * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Confusion Matrix & Global Feature Weights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Confusion Matrix Display */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Test Set Confusion Matrix
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
              <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30">
                <span className="text-slate-400 block text-[10px] uppercase">True Negatives</span>
                <span className="text-2xl font-bold text-emerald-400">{cm[0][0]}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/30">
                <span className="text-slate-400 block text-[10px] uppercase">False Positives</span>
                <span className="text-2xl font-bold text-rose-400">{cm[0][1]}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/30">
                <span className="text-slate-400 block text-[10px] uppercase">False Negatives</span>
                <span className="text-2xl font-bold text-rose-400">{cm[1][0]}</span>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30">
                <span className="text-slate-400 block text-[10px] uppercase">True Positives</span>
                <span className="text-2xl font-bold text-emerald-400">{cm[1][1]}</span>
              </div>
            </div>
          </div>

          {/* Global Feature Weights List */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Global Feature Importance Weights
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {Object.entries(importances)
                .sort((a, b) => b[1] - a[1])
                .map(([feat, weight]) => (
                  <div key={feat} className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg">
                    <span className="text-slate-300 font-medium">{feat}</span>
                    <span className="text-teal-400 font-mono font-bold">{(weight * 100).toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
