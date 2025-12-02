import React from 'react';
import { AppState } from '../types';

interface UIProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
}

export const UI: React.FC<UIProps> = ({ appState, setAppState }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-8 md:p-16 z-10">
      
      {/* Header */}
      <header className="flex flex-col items-center md:items-start animate-fade-in-down">
        <h1 className="font-serif text-3xl md:text-5xl text-amber-400 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
          Arix
        </h1>
        <h2 className="font-sans text-xs md:text-sm text-indigo-200 tracking-[0.3em] mt-2 uppercase drop-shadow-md">
          Munich Signature Edition
        </h2>
      </header>

      {/* Controls */}
      <div className="flex flex-col items-center md:items-end gap-6 pointer-events-auto">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setAppState(
              appState === AppState.SCATTERED ? AppState.TREE_SHAPE : AppState.SCATTERED
            )}
            className={`
              group relative px-8 py-3 overflow-hidden rounded-full transition-all duration-500
              ${appState === AppState.TREE_SHAPE 
                ? 'bg-indigo-950/80 border border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.3)]' 
                : 'bg-transparent border border-white/20'}
            `}
          >
            <span className={`
              relative z-10 font-sans text-xs tracking-[0.2em] font-bold uppercase transition-colors duration-300
              ${appState === AppState.TREE_SHAPE ? 'text-amber-400' : 'text-indigo-100'}
            `}>
              {appState === AppState.TREE_SHAPE ? 'Scatter Elements' : 'Assemble Tree'}
            </span>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
          </button>
          
          <span className="text-[10px] text-indigo-300/50 tracking-widest font-mono uppercase">
            {appState === AppState.TREE_SHAPE ? 'Structure Active' : 'Entropy Active'}
          </span>
        </div>
      </div>

      {/* Footer / Status */}
      <div className="flex justify-center md:justify-between items-end">
        <div className="hidden md:block w-32 h-[1px] bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent" />
        <p className="font-serif text-indigo-200/60 italic text-sm">
          "Lights over Marienplatz"
        </p>
        <div className="hidden md:block w-32 h-[1px] bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent" />
      </div>

    </div>
  );
};
