import React from 'react';
import { 
  Stethoscope, Activity, Cpu, ShieldCheck, ArrowRight, BarChart3, 
  CheckCircle2, Sparkles, AlertTriangle, Users, BookOpen 
} from 'lucide-react';

export default function HomePage({ setActivePage }) {
  return (
    <div className="space-y-16 py-6 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-card rounded-3xl p-8 sm:p-12 border border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Machine Learning Health Intelligence
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Predict Your Diabetes Risk with <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Explainable AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Evaluate your diabetes likelihood in seconds using our clinical machine learning model trained on the Pima Indians Diabetes dataset. Receive instant risk scores, feature impact breakdowns, and personalized lifestyle guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('predict')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-base hover:from-teal-400 hover:to-cyan-400 shadow-xl shadow-teal-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <Stethoscope className="w-5 h-5" />
              Check Your Risk Now
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActivePage('about')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-5 h-5 text-teal-400" />
              Learn About Model Architecture
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-teal-400">81.9%</div>
              <div className="text-xs text-slate-400 mt-0.5">ROC-AUC Model Score</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-cyan-400">768</div>
              <div className="text-xs text-slate-400 mt-0.5">Clinical Samples Trained</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">8 Factors</div>
              <div className="text-xs text-slate-400 mt-0.5">Biomedical Indicators</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-amber-400">XAI Powered</div>
              <div className="text-xs text-slate-400 mt-0.5">Transparent Risk Attribution</div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How It Works</h2>
          <p className="text-sm text-slate-400">Simple 4-step process for instant risk evaluation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-white">Enter Health Metrics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Input 8 standard health measurements such as Fasting Glucose, BMI, Age, and Blood Pressure.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-white">ML Model Inference</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our trained Gradient Boosting model standardizes inputs and calculates risk probability.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-white">Explainable AI Chart</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View factor contributions highlighting exactly which metrics increased or lowered your risk score.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-lg">
              4
            </div>
            <h3 className="text-base font-bold text-white">Actionable Guidance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive practical dietary and lifestyle habits based on clinical prediabetes guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-l-teal-500">
          <BarChart3 className="w-8 h-8 text-teal-400" />
          <h3 className="text-lg font-bold text-white">Interactive Dashboard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor historical prediction trends, glucose vs BMI distributions, and risk probability progression over time.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-l-cyan-500">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Secure User Accounts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Optional JWT account creation keeps your health log confidential with bcrypt password encryption.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border-l-4 border-l-emerald-500">
          <BookOpen className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">AI Health Assistant</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ask general diabetes awareness questions about normal blood sugar, BMI categories, and common symptoms.
          </p>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-bold text-amber-300">Important Medical Disclaimer</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              DiaPredictAI is designed purely for educational and risk-screening demonstration purposes. The ML predictions generated are not medical diagnoses, treatment decisions, or clinical recommendations. Users should never disregard professional medical advice or delay seeking treatment based on software predictions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
