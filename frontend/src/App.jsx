import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import AIAssistantPage from './pages/AIAssistantPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />;
      case 'predict':
        return <PredictionPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'history':
        return <HistoryPage />;
      case 'chat':
        return <AIAssistantPage />;
      case 'admin':
        return <AdminPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage setActivePage={setActivePage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderPage()}
        </main>

        <Footer setActivePage={setActivePage} />
      </div>
    </AuthProvider>
  );
}
