import React, { useState, useEffect } from 'react';
import { 
  History, Download, Trash2, Eye, Calendar, 
  Activity, ShieldAlert, LogIn, AlertCircle 
} from 'lucide-react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ExplainableAIChart from '../components/ExplainableAIChart';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchHistory = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiRequest('/history', 'GET');
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch prediction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this prediction record?")) return;
    try {
      await apiRequest(`/history/${recordId}`, 'DELETE');
      setHistory(prev => prev.filter(item => item.id !== recordId));
      if (selectedRecord && selectedRecord.id === recordId) {
        setSelectedRecord(null);
      }
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    }
  };

  const exportCSV = () => {
    if (!history.length) return;
    const headers = ["ID", "Timestamp", "Glucose", "BMI", "Age", "BP", "Result", "Probability (%)"];
    const rows = history.map(r => [
      r.id,
      r.timestamp,
      r.inputs.Glucose,
      r.inputs.BMI,
      r.inputs.Age,
      r.inputs.BloodPressure,
      r.risk_level,
      r.probability_percentage
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `diabetes_prediction_history_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
          <History className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Prediction History Log</h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          Sign in to your account to automatically log and review your historical diabetes risk assessments over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-teal-400" /> Assessment History Log
          </h1>
          <p className="text-xs text-slate-400">Review your past prediction results and Explainable AI factors</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-300 border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export CSV Log
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center space-y-3">
          <p className="text-sm text-slate-400">No past prediction records logged yet.</p>
          <p className="text-xs text-slate-500">Go to the Prediction page to run your first assessment.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Glucose</th>
                  <th className="p-4">BMI</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Probability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono font-semibold text-cyan-300">{record.inputs.Glucose} mg/dL</td>
                    <td className="p-4 font-mono">{record.inputs.BMI}</td>
                    <td className="p-4 font-mono">{record.inputs.Age} yrs</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                        record.prediction === 1
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {record.risk_level}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold">{record.probability_percentage}%</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-colors"
                        title="View XAI Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Inspect Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl glass-card rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-700">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Prediction Details #{selectedRecord.id}</h3>
                <p className="text-xs text-slate-400">{new Date(selectedRecord.timestamp).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedRecord.prediction === 1 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {selectedRecord.risk_level} ({selectedRecord.probability_percentage}%)
              </span>
            </div>

            <ExplainableAIChart featureContributions={selectedRecord.feature_contributions} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl text-xs">
              <div><span className="text-slate-500">Glucose:</span> <strong className="text-white block">{selectedRecord.inputs.Glucose} mg/dL</strong></div>
              <div><span className="text-slate-500">BMI:</span> <strong className="text-white block">{selectedRecord.inputs.BMI}</strong></div>
              <div><span className="text-slate-500">Age:</span> <strong className="text-white block">{selectedRecord.inputs.Age} yrs</strong></div>
              <div><span className="text-slate-500">BP:</span> <strong className="text-white block">{selectedRecord.inputs.BloodPressure} mmHg</strong></div>
            </div>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
            >
              Close Record View
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
