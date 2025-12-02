import React, { useState } from 'react';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import { AppState } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);

  return (
    <main className="relative w-full h-screen bg-[#1e1b4b] text-white overflow-hidden">
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Experience appState={appState} />
      </div>

      {/* UI Layer */}
      <UI appState={appState} setAppState={setAppState} />

      {/* Noise Overlay for texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-20" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </main>
  );
}
