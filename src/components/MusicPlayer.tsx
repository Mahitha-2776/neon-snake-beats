import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "DATA_STREAM_01.WAV",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "MEMORY_LEAK.MP3",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "CORRUPT_SECTOR.FLAC",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("ERR_PLAYBACK:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("ERR_PLAYBACK:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleEnded = () => {
    playNext();
  };

  return (
    <div className="bg-black border-2 border-cyan-500 p-4 w-full max-w-md mx-auto relative group">
      {/* Glitch decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      
      <div className="flex items-center justify-between mb-4 border-b border-cyan-500/50 pb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 border-2 border-fuchsia-500 flex items-center justify-center bg-black ${isPlaying ? 'animate-[pulse_0.5s_steps(2)_infinite]' : ''}`}>
            <span className="text-fuchsia-500 font-bold text-xl">♪</span>
          </div>
          <div>
            <h3 className="text-cyan-400 font-bold text-xl tracking-widest uppercase">
              {currentTrack.title}
            </h3>
            <p className="text-fuchsia-500 text-sm tracking-widest uppercase">AUTHOR: {currentTrack.artist}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={playPrev}
          className="px-3 py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-none uppercase tracking-widest text-sm"
        >
          [PREV]
        </button>
        
        <button 
          onClick={togglePlay}
          className="px-6 py-2 border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-none uppercase tracking-widest font-bold"
        >
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        
        <button 
          onClick={playNext}
          className="px-3 py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-none uppercase tracking-widest text-sm"
        >
          [NEXT]
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-cyan-500/50 pt-3">
        <span className="text-cyan-500 text-sm tracking-widest">VOL</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-2 bg-black border border-cyan-500 appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
