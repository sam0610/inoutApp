
import React, { useState } from 'react';
import { LogEntry } from '../types';
import { getAIHealthInsights } from '../services/geminiService';
import { Sparkles, BrainCircuit, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface AIInsightsProps {
  entries: LogEntry[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ entries }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const result = await getAIHealthInsights(entries);
      setInsight(result);
    } catch (e) {
      setInsight("抱歉，分析時發生了些問題。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit size={120} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Sparkles className="text-indigo-200" /> AI 健康助手
          </h2>
          <p className="text-indigo-100/70 text-sm font-medium leading-relaxed">
            我們將分析您的歷史數據，為您提供個性化的水分管理建議。
          </p>
          
          <button 
            onClick={fetchInsights}
            disabled={loading || entries.length === 0}
            className="mt-8 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
            {insight ? '重新分析' : '開始 AI 分析'}
          </button>
        </div>
      </div>

      {insight ? (
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">分析報告</h3>
          </div>
          <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap font-medium">
            {insight}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <AlertCircle size={12} /> 本分析僅供參考，不具醫療效力
          </div>
        </div>
      ) : (
        !loading && entries.length > 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-30 grayscale">
            <BrainCircuit size={64} className="text-slate-300 mb-4" />
            <p className="text-sm font-bold text-slate-400">點擊按鈕獲取見解</p>
          </div>
        )
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-sm font-bold text-slate-400 animate-pulse">正在閱讀數據並思考中...</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
