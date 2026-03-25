/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 font-mono overflow-hidden relative flex flex-col items-center justify-center p-4 selection:bg-fuchsia-500 selection:text-black">
      {/* Overlays */}
      <div className="scanlines"></div>
      <div className="noise"></div>

      {/* Main Content */}
      <div className="z-10 w-full h-full flex flex-col items-center justify-center relative screen-tear">
        <div className="mb-2 text-center border-b-2 border-fuchsia-500 pb-4 w-full max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 mb-2 tracking-widest glitch" data-text="SYS.OP // KINETIC_SNAKE">
            SYS.OP // KINETIC_SNAKE
          </h1>
          <p className="text-fuchsia-500 text-xl tracking-[0.3em]">
            [ NEURAL LINK ESTABLISHED ]
          </p>
        </div>
        
        {/* Center: Snake Game */}
        <div className="flex justify-center items-center mt-4">
          <SnakeGame />
        </div>

        {/* Floating Widget: Music Player */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-8 lg:right-8 w-full max-w-sm px-4 lg:px-0">
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
