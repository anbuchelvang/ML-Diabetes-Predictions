import React, { useState } from 'react';
import { 
  Stethoscope, RotateCcw, AlertTriangle, CheckCircle2, 
  HelpCircle, Sparkles, Activity, ShieldAlert, ChevronRight, Info
} from 'lucide-react';
import { apiRequest } from '../services/api';
import ExplainableAIChart from '../components/ExplainableAIChart';

const PRESET_EXAMPLES = [
  {
    name: "Low Risk Baseline",
    values: {
      Pregnancies: 1,
      Glucose: 85,
      BloodPressure: 66,
      SkinThickness: 29,
      Insulin: 0,
      BMI: 26.6,
      DiabetesPedigreeFunction: 0.351,
      Age: 31
    }
  },
  {
    name: "Elevated Glucose Example",
    values: {
      Pregnancies: 3,
      Glucose: 135,
      BloodPressure: 78,
      SkinThickness: 20,
      Insulin: 110,
      BMI: 29.4,
      DiabetesPedigreeFunction: 0.452,
      Age: 42
    }
  },
  {
    name: "High Risk Clinical Example",
    values: {
      Pregnancies: 8,
      Glucose: 183,
      BloodPressure: 72,
      SkinThickness: 35,
      Insulin: 0,
      BMI: 33.6,
      DiabetesPedigreeFunction: 0.627,
      Age: 50
    }
  }
];

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    Pregnancies: 1,
    Glucose: 110,
    BloodPressure: 70,
    SkinThickness: 20,
    Insulin: 80,
    BMI: 28.5,
    DiabetesPedigreeFunction: 0.45,
    Age: 35
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleApplyPreset = (presetValues) => {
    setFormData(presetValues);
    setResult(null);
    setError('');
  };

  const handleReset = () => {
    setFormData({
      Pregnancies: 0,
      Glucose: 100,
      BloodPressure: 70,
      SkinThickness: 20,
      Insulin: 0,
      BMI: 25.0,
      DiabetesPedigreeFunction: 0.35,
      Age: 30
    });
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/predict', 'POST', formData);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate prediction. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold uppercase">
          <Stethoscope className="w-4 h-4 text-teal-400" />
          Diabetes Risk Predictor
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Comprehensive Health Risk Assessment
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Enter standard biomedical parameters below or load clinical presets to test prediction outcomes.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-slate-800">
        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-400" /> Quick Preset Clinical Samples:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_EXAMPLES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset.values)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Form & Input Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pregnancies */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">Pregnancies</label>
              <span className="text-teal-400 font-mono font-bold">{formData.Pregnancies}</span>
            </div>
            <input
              type="range"
              name="Pregnancies"
              min="0"
              max="17"
              step="1"
              value={formData.Pregnancies}
              onChange={handleChange}
              className="w-full accent-teal-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Number of times pregnant (0 – 17)</p>
          </div>

          {/* Glucose */}
          <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-teal-500">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1">
                Fasting Glucose <span className="text-[10px] text-slate-400">(mg/dL)</span>
              </label>
              <span className="text-teal-400 font-mono font-bold">{formData.Glucose} mg/dL</span>
            </div>
            <input
              type="number"
              name="Glucose"
              min="0"
              max="300"
              value={formData.Glucose}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400">Fasting blood glucose concentration. (Normal: 70–99)</p>
          </div>

          {/* Blood Pressure */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">
                Blood Pressure <span className="text-[10px] text-slate-400">(Diastolic mmHg)</span>
              </label>
              <span className="text-cyan-400 font-mono font-bold">{formData.BloodPressure} mmHg</span>
            </div>
            <input
              type="number"
              name="BloodPressure"
              min="0"
              max="140"
              value={formData.BloodPressure}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400">Diastolic blood pressure. (Normal: 60–80)</p>
          </div>

          {/* Skin Thickness */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">
                Triceps Skin Fold <span className="text-[10px] text-slate-400">(mm)</span>
              </label>
              <span className="text-cyan-400 font-mono font-bold">{formData.SkinThickness} mm</span>
            </div>
            <input
              type="number"
              name="SkinThickness"
              min="0"
              max="99"
              value={formData.SkinThickness}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400">Subcutaneous tissue thickness. (0 if unknown)</p>
          </div>

          {/* Insulin */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">
                2-Hour Serum Insulin <span className="text-[10px] text-slate-400">(mu U/ml)</span>
              </label>
              <span className="text-cyan-400 font-mono font-bold">{formData.Insulin} mu U/ml</span>
            </div>
            <input
              type="number"
              name="Insulin"
              min="0"
              max="846"
              value={formData.Insulin}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400">Serum insulin after 2 hours. (0 if unknown)</p>
          </div>

          {/* BMI */}
          <div className="glass-card p-5 rounded-2xl space-y-2 border-l-4 border-l-cyan-500">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">
                Body Mass Index <span className="text-[10px] text-slate-400">(BMI kg/m²)</span>
              </label>
              <span className="text-teal-400 font-mono font-bold">{formData.BMI}</span>
            </div>
            <input
              type="number"
              step="0.1"
              name="BMI"
              min="0"
              max="70"
              value={formData.BMI}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400">Weight in kg / height in m². (Normal: 18.5–24.9)</p>
          </div>

          {/* Diabetes Pedigree Function */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">Diabetes Pedigree Function</label>
              <span className="text-teal-400 font-mono font-bold">{formData.DiabetesPedigreeFunction}</span>
            </div>
            <input
              type="number"
              step="0.01"
              name="DiabetesPedigreeFunction"
              min="0.05"
              max="2.5"
              value={formData.DiabetesPedigreeFunction}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:border-teal-500"
            />
            <p className="text-[11px] text-slate-400">Genetic likelihood based on family history (0.08 – 2.42)</p>
          </div>

          {/* Age */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200">Age</label>
              <span className="text-teal-400 font-mono font-bold">{formData.Age} years</span>
            </div>
            <input
              type="range"
              name="Age"
              min="18"
              max="100"
              value={formData.Age}
              onChange={handleChange}
              className="w-full accent-teal-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Age in years (18 – 100)</p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-cyan-400 shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                Analyzing ML Model...
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5" /> Calculate Risk Score
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-sm text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Prediction Result Display Card */}
      {result && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-8 border-2 border-teal-500/40 glow-teal animate-fade-in">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
            
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-mono">
                Prediction Assessment Record #{result.record_id || 'Instant'}
              </div>
              <h2 className="text-2xl font-bold text-white">Assessment Result</h2>
              <p className="text-xs text-slate-400">Generated by Gradient Boosting Classifier</p>
            </div>

            {/* Risk Gauge Badge */}
            <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center min-w-[240px] text-center ${
              result.risk_level === 'High Risk'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 glow-rose'
                : result.risk_level === 'Moderate Risk'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}>
              <span className="text-xs font-semibold uppercase tracking-wider">Risk Level</span>
              <span className="text-3xl font-black mt-1">{result.risk_level}</span>
              <div className="mt-2 text-lg font-bold font-mono">
                {result.probability_percentage}% Probability
              </div>
            </div>

          </div>

          {/* Explainable AI Bar Chart */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <ExplainableAIChart featureContributions={result.feature_contributions} />
          </div>

          {/* Personalized Health Guidance */}
          {result.guidance && (
            <div className="space-y-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" /> Evidence-Based Clinical Guidance
              </h3>
              <p className="text-xs text-slate-300">{result.guidance.summary}</p>
              <ul className="space-y-2 pt-2">
                {result.guidance.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Medical Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              {result.disclaimer}
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
