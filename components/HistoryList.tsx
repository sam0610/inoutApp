
import React from 'react';
import { LogEntry } from '../types';
import { Trash2, Droplets, Activity, Clock, Calendar } from 'lucide-react';

interface HistoryListProps {
  entries: LogEntry[];
  onDelete: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Calendar size={32} />
        </div>
        <p className="font-bold">尚無歷史紀錄</p>
        <p className="text-sm">點擊右下角按鈕開始記錄</p>
      </div>
    );
  }

  // Group by date
  const grouped = entries.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-8">
      {sortedDates.map(date => (
        <div key={date} className="space-y-4">
          <div className="sticky top-16 z-30 bg-slate-50/90 backdrop-blur py-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{date}</h3>
          </div>
          <div className="space-y-3">
            {grouped[date].map(entry => (
              <HistoryItem key={entry.id} entry={entry} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const HistoryItem: React.FC<{ entry: LogEntry; onDelete: (id: string) => void }> = ({ entry, onDelete }) => {
  const isWater = entry.type === 'water';
  const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="group bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:border-slate-200">
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${
        isWater ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {isWater ? <Droplets size={20} /> : <Activity size={20} />}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-lg font-black text-slate-800">
              {entry.amount} <span className="text-xs font-bold text-slate-400">ml</span>
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Clock size={10} />
              {time}
            </div>
          </div>
          <button 
            onClick={() => onDelete(entry.id)}
            className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
        {entry.note && (
          <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-xl italic">
            「{entry.note}」
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
