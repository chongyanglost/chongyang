import React from 'react';
import { MantraParts } from '../types';
import { Volume2, Quote } from 'lucide-react';

interface MantraCardProps {
  mantra: MantraParts;
}

export const MantraCard: React.FC<MantraCardProps> = ({ mantra }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-primary-50 p-6 text-center border-b border-primary-100">
        <h2 className="text-primary-800 font-bold text-lg flex items-center justify-center gap-2">
          <Volume2 size={20} />
          大声朗读三次
        </h2>
        <p className="text-primary-600 text-sm mt-1">告诉你的大脑，这就是现在的你</p>
      </div>
      
      <div className="p-8 md:p-10 flex flex-col items-center justify-center space-y-6">
        <Quote className="text-primary-200 w-12 h-12 rotate-180 self-start -mb-4" />
        
        <div className="space-y-6 text-center w-full">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Identity</p>
            <p className="text-2xl md:text-3xl font-serif font-bold text-gray-800 leading-tight">
              {mantra.identity}
            </p>
          </div>

          <div className="w-16 h-1 bg-primary-100 mx-auto rounded-full"></div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Benefit</p>
            <p className="text-xl md:text-2xl font-serif text-gray-700">
              {mantra.benefit}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Emotion</p>
            <p className="text-xl md:text-2xl font-serif text-primary-600 font-medium">
              {mantra.emotion}
            </p>
          </div>
        </div>

        <Quote className="text-primary-200 w-12 h-12 self-end -mt-4" />
      </div>
    </div>
  );
};