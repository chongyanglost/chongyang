import React, { useState, useEffect } from 'react';
import { HabitForm } from './components/HabitForm';
import { MantraCard } from './components/MantraCard';
import { ShareView } from './components/ShareView';
import { generateMantra } from './services/gemini';
import { AppState, HabitData } from './types';
import { CheckCircle2, RotateCcw } from 'lucide-react';

// Confetti logic (simplified for React w/o external heavy libs)
const fireConfetti = () => {
  const count = 200;
  // We are just simulating the logic trigger here. 
  console.log("Confetti fired!");
};

const STORAGE_KEY = 'habit_mantra_data';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [habitData, setHabitData] = useState<HabitData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHabitData(parsed);
        setAppState(AppState.ACTIVE);
      } catch (e) {
        console.error("Failed to parse saved habit data");
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleCreateHabit = async (goal: string) => {
    setIsLoading(true);
    setAppState(AppState.GENERATING);
    
    try {
      const mantra = await generateMantra(goal);
      const newData: HabitData = {
        id: Date.now().toString(),
        originalGoal: goal,
        mantra,
        createdAt: Date.now(),
        checkIns: 0,
        lastCheckInDate: null
      };
      
      setHabitData(newData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setAppState(AppState.ACTIVE);
    } catch (error) {
      console.error(error);
      alert("Failed to generate mantra. Please try again.");
      setAppState(AppState.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = () => {
    if (!habitData) return;

    // Check if already checked in today (simple string comparison)
    const today = new Date().toDateString();
    if (habitData.lastCheckInDate === today) {
        // Already checked in, just go to view
        setAppState(AppState.CELEBRATING);
        return;
    }

    const updatedData = {
      ...habitData,
      checkIns: habitData.checkIns + 1,
      lastCheckInDate: today
    };

    setHabitData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    fireConfetti();
    setAppState(AppState.CELEBRATING);
  };

  const handleBackToDashboard = () => {
    // Just go back to active view (Mantra card)
    setAppState(AppState.ACTIVE);
  };

  const handleResetGoal = () => {
      // Removed window.confirm to ensure the button works immediately and responsively.
      // The user reported "no reaction" which implies the confirm dialog might be blocked or failing.
      setHabitData(null);
      localStorage.removeItem(STORAGE_KEY);
      setAppState(AppState.IDLE);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans selection:bg-primary-200">
      
      {/* Header / Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-serif font-bold gradient-text">HabitMantra</div>
        {appState !== AppState.IDLE && (
            <button 
              onClick={handleResetGoal} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
            >
                <RotateCcw size={14} />
                重设目标
            </button>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center min-h-[85vh]">
        
        {appState === AppState.IDLE || appState === AppState.GENERATING ? (
          <div className="w-full max-w-lg">
             <HabitForm onSubmit={handleCreateHabit} isLoading={isLoading} />
          </div>
        ) : null}

        {appState === AppState.ACTIVE && habitData && (
          <div className="w-full max-w-lg space-y-8 animate-fade-in">
             <div className="text-center space-y-2">
                <h3 className="text-gray-400 text-sm tracking-wider uppercase">你的专属微习惯咒语</h3>
             </div>
             
             <MantraCard mantra={habitData.mantra} />

             <div className="pt-4 space-y-6">
                <button 
                  onClick={handleCheckIn}
                  className="group w-full relative overflow-hidden bg-primary-600 text-white rounded-2xl p-6 shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <CheckCircle2 size={32} />
                    <span className="text-2xl font-bold">我做到了! 打卡</span>
                  </div>
                  <p className="text-primary-100 mt-2 text-sm relative z-10">完成动作后点击此处</p>
                </button>

                <div className="text-center">
                  <button 
                    onClick={handleResetGoal}
                    className="text-xs text-gray-400 hover:text-gray-600 underline decoration-gray-300 underline-offset-4 transition-colors"
                  >
                    觉得咒语不合适？返回重设目标
                  </button>
                </div>
             </div>
             
             <div className="text-center text-gray-400 text-sm">
                当前连续坚持: <span className="text-primary-600 font-bold text-lg">{habitData.checkIns}</span> 天
             </div>
          </div>
        )}

        {appState === AppState.CELEBRATING && habitData && (
          <ShareView 
            mantra={habitData.mantra} 
            daysStreak={habitData.checkIns} 
            onContinue={handleBackToDashboard}
            onResetGoal={handleResetGoal}
          />
        )}

      </main>
    </div>
  );
};

export default App;