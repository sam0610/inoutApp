
import React, { useState } from 'react';
import { LogEntry, EntryType } from '../types';
import { X, Check, Clock, Info } from 'lucide-react';

interface EntryFormProps {
  type: EntryType;
  presets: number[];
  onSave: (entry: Omit<LogEntry, 'id'>) => void;
  onCancel: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ type, presets, onSave, onCancel }) => {
  const defaultAmount = presets[0] ? presets[0].toString() : '250';
  const [amount, setAmount] = useState<string>(defaultAmount);
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState<string>('');

  const isWater = type === 'water';
  const themeColor = isWater ? 'blue' : 'amber';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    onSave({
      type,
      amount: val,
      timestamp: new Date(timestamp).toISOString(),
      note: note.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className={`p-6 bg-gradient-to-br from-${themeColor}-500 to-${themeColor}-600 text-white flex justify-between items-center`}>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {isWater ? '記錄飲水' : '記錄排尿'}
            </h3>
            <p className="text-white/80 text-sm">請輸入時間及毫升數</p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider block">
              攝入/排出量 (ml)
            </label>
            <div className="relative">
              <input 
                autoFocus
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full text-4xl font-bold border-b-2 border-slate-100 py-3 focus:outline-none focus:border-${themeColor}-500 transition-colors bg-transparent`}
                placeholder="0"
                required
              />
              <span className="absolute right-0 bottom-4 text-slate-400 font-medium">毫升</span>
            </div>
            {/* Quick selectors */}
            <div className="flex gap-2 pt-2 flex-wrap">
              {presets.map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v.toString())}
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    amount === v.toString() 
                      ? `bg-${themeColor}-500 text-white border-${themeColor}-500` 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                  } transition-all`}
                >
                  +{v}
                </button>
              ))}
            </div>
          </div>

          {/* Time Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} /> 時間
            </label>
            <input 
              type="datetime-local" 
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700"
              required
            />
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Info size={14} /> 備註 (選填)
            </label>
            <input 
              type="text" 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例如：餐後、運動後..."
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <button 
            type="submit"
            className={`w-full py-4 bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-${themeColor}-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]`}
          >
            <Check size={20} /> 儲存紀錄
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
