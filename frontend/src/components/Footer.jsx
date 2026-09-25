import React from 'react';
import { Activity, ShieldAlert, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full glass-card border-t border-slate-800 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-white">
              DiaPredict<span className="text-teal-400">AI</span>
            </span>
          </div>

          <div className="flex justify-center gap-6 text-sm text-slate-400">
            <button onClick={() => setActivePage('home')} className="hover:text-teal-300 transition-colors">Home</button>
            <button onClick={() => setActivePage('predict')} className="hover:text-teal-300 transition-colors">Risk Assessment</button>
            <button onClick={() => setActivePage('dashboard')} className="hover:text-teal-300 transition-colors">Dashboard</button>
            <button onClick={() => setActivePage('chat')} className="hover:text-teal-300 transition-colors">AI Assistant</button>
            <button onClick={() => setActivePage('about')} className="hover:text-teal-300 transition-colors">ML Details</button>
          </div>

          <div className="flex justify-end items-center gap-2 text-xs text-slate-400">
            <span>Powered by Scikit-Learn & Flask</span>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-xs text-amber-200/90 items-start">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300 font-semibold">Educational & Screening Notice:</strong> This application utilizes a Machine Learning classification model trained on historical biomedical indicators (Pima Indians Diabetes Dataset). The predictions generated are statistical probability estimates intended for risk assessment and educational awareness only. <strong className="underline text-amber-300">This tool does NOT provide clinical medical diagnosis or treatment advice.</strong> Always consult a qualified physician or healthcare provider regarding any health concerns.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 gap-2">
          <span>&copy; {new Date().getFullYear()} DiaPredictAI. Educational & Risk Assessment Platform.</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Healthcare Innovation.
          </span>
        </div>

      </div>
    </footer>
  );
}
