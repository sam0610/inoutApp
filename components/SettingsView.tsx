
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Settings, Plus, X, Droplets, Activity } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [waterVal, setWaterVal] = useState('');
  const [urineVal, setUrineVal] = useState('');

  const addPreset = (type: 'water' | 'urine', val: string) => {
    const num = parseInt(val);
    if (isNaN(num) || num <= 0) return;
    
    const key = type === 'water' ? 'waterPresets' : 'urinePresets';
    if (settings[key].includes(num)) return;

    onUpdateSettings({
      ...settings,
      [key]: [...settings[key], num].sort((a, b) => a - b)
    });
    
    if (type === 'water') setWaterVal('');
    else setUrineVal('');
  };

  const removePreset = (type: 'water' | 'urine', val: number) => {
    const key = type === 'water' ? 'waterPresets' : 'urinePresets';
    onUpdateSettings({
      ...settings,
      [key]: settings[key].filter(v => v !== val)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Droplets size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">飲水預設量</h3>
            <p className="text-xs text-slate-400">快速選擇常用的毫升數</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {settings.waterPresets.map(val => (
            <div key={val} className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 animate-in zoom-in">
              {val}ml
              <button onClick={() => removePreset('water', val)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            value={waterVal}
            onChange={(e) => setWaterVal(e.target.value)}
            placeholder="新增毫升..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button 
            onClick={() => addPreset('water', waterVal)}
            className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">排尿預設量</h3>
            <p className="text-xs text-slate-400">快速選擇常用的毫升數</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {settings.urinePresets.map(val => (
            <div key={val} className="flex items-center gap-1 px-3 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold border border-amber-100 animate-in zoom-in">
              {val}ml
              <button onClick={() => removePreset('urine', val)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            value={urineVal}
            onChange={(e) => setUrineVal(e.target.value)}
            placeholder="新增毫升..."
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
          <button 
            onClick={() => addPreset('urine', urineVal)}
            className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200 active:scale-95"
          >
            <Plus size={20} />
          </button>
        </div>
      </section>

      <div className="p-6 bg-slate-100 rounded-3xl text-center">
        <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tighter">
          設定將自動儲存在您的瀏覽器中。<br/>
          您可以自訂最常使用的量數來加快記錄速度。
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
