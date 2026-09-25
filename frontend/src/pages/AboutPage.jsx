import React from 'react';
import { Info, Database, Cpu, ShieldAlert, Layers, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold uppercase">
          <Info className="w-4 h-4 text-teal-400" /> Machine Learning System Architecture
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          About DiaPredictAI & Pima Dataset Workflow
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          An in-depth technical overview of data preprocessing, model selection, local Explainable AI, and software architecture.
        </p>
      </div>

      {/* Dataset Overview */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Pima Indians Diabetes Dataset</h2>
            <p className="text-xs text-slate-400">National Institute of Diabetes and Digestive and Kidney Diseases</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The dataset consists of 768 clinical records of female patients of Pima Indian heritage aged 21 and older. The target variable is binary (<code className="text-teal-400">0 = Non-Diabetic</code>, <code className="text-rose-400">1 = Diabetic</code>).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">1. Pregnancies</strong>
            <span className="text-slate-400">Number of times pregnant (0 – 17)</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">2. Glucose</strong>
            <span className="text-slate-400">2-hour oral glucose tolerance test (mg/dL)</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">3. Blood Pressure</strong>
            <span className="text-slate-400">Diastolic blood pressure (mmHg)</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">4. Skin Thickness</strong>
            <span className="text-slate-400">Triceps skin fold thickness (mm)</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">5. Insulin</strong>
            <span className="text-slate-400">2-Hour serum insulin (mu U/ml)</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">6. BMI</strong>
            <span className="text-slate-400">Body Mass Index (weight in kg / (height in m)²)</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">7. Diabetes Pedigree Function</strong>
            <span className="text-slate-400">Genetic likelihood function score</span>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <strong className="text-teal-300 block">8. Age</strong>
            <span className="text-slate-400">Age in years (21 – 81)</span>
          </div>
        </div>
      </div>

      {/* Machine Learning Pipeline Breakdown */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">ML Training & Preprocessing Pipeline</h2>
            <p className="text-xs text-slate-400">Robust data engineering and model evaluation</p>
          </div>
        </div>

        <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside">
          <li className="leading-relaxed">
            <strong className="text-white font-semibold">Biological Zero Imputation:</strong> Biologically impossible zero values in features like Fasting Glucose, Blood Pressure, Skin Thickness, Insulin, and BMI are imputed with non-zero medians computed per metric.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white font-semibold">Standard Scaling:</strong> Features are standardized using <code className="text-teal-400">StandardScaler</code> (z = (x - mean) / std) to ensure uniform distance metrics across algorithms.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white font-semibold">Model Comparison:</strong> Logistic Regression, Random Forest, and Gradient Boosting Classifiers are evaluated under 80/20 stratified train/test split.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white font-semibold">Best Model Export:</strong> The model achieving optimal F1-score & ROC-AUC (~0.82) is serialized using <code className="text-teal-400">joblib</code> to <code className="text-teal-400">model.pkl</code> and <code className="text-teal-400">scaler.pkl</code>.
          </li>
          <li className="leading-relaxed">
            <strong className="text-white font-semibold">Explainable AI (XAI):</strong> Individual prediction inputs calculate local feature impact weights to visualize top risk drivers.
          </li>
        </ol>
      </div>

      {/* Software Tech Stack */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl space-y-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Technology Stack</h2>
            <p className="text-xs text-slate-400">Full-stack modern healthcare web application</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-xl space-y-1.5 border border-slate-800">
            <strong className="text-teal-400 font-bold block">Frontend</strong>
            <p className="text-slate-300">React.js, Vite, Tailwind CSS, Lucide React, Recharts analytics.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl space-y-1.5 border border-slate-800">
            <strong className="text-cyan-400 font-bold block">Backend REST API</strong>
            <p className="text-slate-300">Python, Flask REST API, SQLite (SQLAlchemy), PyJWT, Werkzeug bcrypt.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl space-y-1.5 border border-slate-800">
            <strong className="text-emerald-400 font-bold block">Machine Learning</strong>
            <p className="text-slate-300">Scikit-Learn, Pandas, NumPy, Joblib model serialization.</p>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-300 font-semibold">Disclaimer:</strong> DiaPredictAI is designed for educational demonstration and health risk assessment only. Predictions generated by this system are based on statistical patterns in historical Pima dataset records and must not be considered medical diagnoses.
        </p>
      </div>

    </div>
  );
}
