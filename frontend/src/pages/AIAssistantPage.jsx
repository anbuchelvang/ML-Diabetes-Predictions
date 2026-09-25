import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User as UserIcon, Sparkles, ShieldAlert, AlertCircle } from 'lucide-react';
import { apiRequest } from '../services/api';

const QUICK_PROMPTS = [
  "What is normal blood glucose?",
  "What is BMI and why does it matter?",
  "What are common diabetes symptoms?",
  "What lifestyle habits reduce risk?",
  "What is Diabetes Pedigree Function?"
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your AI Diabetes Health Assistant. You can ask me general educational questions regarding blood glucose levels, BMI categories, risk factors, or preventive habits.\n\n*Note: I cannot diagnose conditions or prescribe medications.*"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await apiRequest('/chat', 'POST', { message: query });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I encountered an issue connecting to the AI Assistant service. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 animate-fade-in flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              AI Diabetes Assistant
            </h1>
            <p className="text-xs text-slate-400">Interactive health Q&A and prediabetes education</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" /> Non-Diagnostic Educational AI
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Suggestions:
        </span>
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Window */}
      <div className="glass-card rounded-2xl p-6 flex-1 overflow-y-auto space-y-4 border border-slate-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask a question about diabetes symptoms, glucose ranges, diet, etc..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs hover:from-teal-400 hover:to-cyan-400 shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>

    </div>
  );
}
