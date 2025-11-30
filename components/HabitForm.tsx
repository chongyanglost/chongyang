import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HabitFormProps {
  onSubmit: (goal: string) => void;
  isLoading: boolean;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onSubmit(goal);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mb-4 animate-float">
          <Sparkles size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-serif">开启你的微习惯</h1>
        <p className="text-gray-500 text-sm">输入一个宏大的目标，我们将把它转化为一个无法失败的微小起步。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="例如：我要练出腹肌，我要读完100本书..."
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400 text-lg"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!goal.trim() || isLoading}
          className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all transform active:scale-95
            ${!goal.trim() || isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 shadow-lg hover:shadow-primary-500/30'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              生成微习惯中...
            </span>
          ) : (
            <>
              生成我的咒语 <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};