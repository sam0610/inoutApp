
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Droplets, 
  Activity, 
  PlusCircle, 
  History, 
  BarChart3, 
  Settings,
  BrainCircuit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LogEntry, EntryType, UserSettings } from './types';
import EntryForm from './components/EntryForm';
import HistoryList from './components/HistoryList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import SettingsView from './components/SettingsView';

const DEFAULT_SETTINGS: UserSettings = {
  waterPresets: [100, 250, 500, 800],
  urinePresets: [100, 200, 300, 400]
};

const App: React.FC = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<'dashboard' | 'history' | 'insights' | 'settings'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<EntryType>('water');

  // Load from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('h2o_logs');
    if (savedLogs) {
      try {
        setEntries(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }

    const savedSettings = localStorage.getItem('h2o_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('h2o_logs', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('h2o_settings', JSON.stringify(settings));
  }, [settings]);

  const addEntry = (entry: Omit<LogEntry, 'id'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: crypto.randomUUID()
    };
    setEntries(prev => [newEntry, ...prev]);
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const clearAllData = () => {
    if (window.confirm('警告：這將會永久刪除所有歷史記錄。確定嗎？')) {
      setEntries([]);
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-50 max-w-lg mx-auto shadow-xl relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            飲水與排尿監測
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Health Tracker Pro</p>
        </div>
        {view === 'history' && entries.length > 0 && (
          <button 
            onClick={clearAllData}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="清除所有資料"
          >
            <Trash2 size={20} />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="px-4 py-6">
        {view === 'dashboard' && <Dashboard entries={entries} />}
        {view === 'history' && <HistoryList entries={entries} onDelete={deleteEntry} />}
        {view === 'insights' && <AIInsights entries={entries} />}
        {view === 'settings' && <SettingsView settings={settings} onUpdateSettings={setSettings} />}
      </main>

      {/* Quick Action Buttons */}
      {!showAddForm && view !== 'settings' && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
          <button 
            onClick={() => { setFormType('urine'); setShowAddForm(true); }}
            className="flex items-center justify-center w-14 h-14 bg-amber-500 text-white rounded-full shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all active:scale-95 group"
          >
            <Activity className="group-hover:animate-bounce" />
          </button>
          <button 
            onClick={() => { setFormType('water'); setShowAddForm(true); }}
            className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 group"
          >
            <Droplets className="group-hover:animate-bounce" />
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-lg border-t border-slate-200 h-20 px-4 flex items-center justify-around z-50">
        <NavButton 
          active={view === 'dashboard'} 
          onClick={() => setView('dashboard')} 
          icon={<BarChart3 />} 
          label="概覽" 
        />
        <NavButton 
          active={view === 'history'} 
          onClick={() => setView('history')} 
          icon={<History />} 
          label="紀錄" 
        />
        <NavButton 
          active={view === 'insights'} 
          onClick={() => setView('insights')} 
          icon={<BrainCircuit />} 
          label="AI 分析" 
        />
        <NavButton 
          active={view === 'settings'} 
          onClick={() => setView('settings')} 
          icon={<Settings />} 
          label="設定" 
        />
      </nav>

      {/* Overlay Add Form */}
      {showAddForm && (
        <EntryForm 
          type={formType} 
          presets={formType === 'water' ? settings.waterPresets : settings.urinePresets}
          onSave={addEntry} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}
    </div>
  );
};

const NavButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all ${
      active ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <div className={`p-1 rounded-lg ${active ? 'bg-blue-50' : ''}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default App;
