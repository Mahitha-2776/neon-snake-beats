import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        setIsPaused(p => !p);
        return;
      }

      if (gameOver || isPaused || !hasStarted) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const currentSpeed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
    const intervalId = setInterval(moveSnake, currentSpeed);

    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div className="w-full flex justify-between items-end mb-2 px-2 border-b-2 border-cyan-500 pb-2">
        <div className="text-fuchsia-500 font-bold text-2xl tracking-widest">
          [ PROCESS: SNAKE ]
        </div>
        <div className="text-right">
          <p className="text-cyan-400 text-2xl tracking-widest">
            MEM_ALLOC: {score.toString().padStart(4, '0')}
          </p>
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-fuchsia-500 overflow-hidden"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {/* Grid Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        />

        {/* Food */}
        <div
          className="absolute bg-fuchsia-500 animate-[pulse_0.2s_steps(2)_infinite]"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-white z-10' : 'bg-cyan-500'}`}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                opacity: isHead ? 1 : Math.max(0.5, 1 - index * 0.03)
              }}
            >
              {isHead && (
                <div className="w-full h-full relative bg-fuchsia-500 flex items-center justify-center">
                  <div className="w-2 h-2 bg-black"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Overlays */}
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-cyan-500 m-2">
            {!hasStarted ? (
              <>
                <h3 className="text-4xl text-cyan-400 mb-6 tracking-widest glitch" data-text="AWAITING_INPUT...">AWAITING_INPUT...</h3>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 bg-fuchsia-500 text-black font-bold text-2xl hover:bg-cyan-500 hover:text-black transition-none uppercase tracking-widest"
                >
                  [ INIT ]
                </button>
              </>
            ) : gameOver ? (
              <>
                <h3 className="text-5xl text-fuchsia-500 mb-2 tracking-widest glitch" data-text="FATAL_ERROR">FATAL_ERROR</h3>
                <p className="text-cyan-400 text-2xl mb-8 tracking-widest">DUMP: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-3 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black font-bold text-2xl transition-none uppercase tracking-widest"
                >
                  [ REBOOT ]
                </button>
              </>
            ) : isPaused ? (
              <>
                <h3 className="text-4xl text-cyan-400 mb-6 tracking-widest glitch" data-text="EXEC_SUSPENDED">EXEC_SUSPENDED</h3>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black font-bold text-2xl transition-none uppercase tracking-widest"
                >
                  [ RESUME ]
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-4 text-cyan-500 text-xl tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-fuchsia-500">DIR:</span>
            <div className="flex gap-1">
              <div className="w-8 h-8 flex items-center justify-center border-2 border-cyan-500 bg-black">W</div>
              <div className="w-8 h-8 flex items-center justify-center border-2 border-cyan-500 bg-black">A</div>
              <div className="w-8 h-8 flex items-center justify-center border-2 border-cyan-500 bg-black">S</div>
              <div className="w-8 h-8 flex items-center justify-center border-2 border-cyan-500 bg-black">D</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-fuchsia-500">HALT:</span>
            <div className="h-8 px-8 flex items-center justify-center border-2 border-cyan-500 bg-black">
              SPACE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
