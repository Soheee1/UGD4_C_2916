import React from "react";
import { FaClock, FaMousePointer, FaSyncAlt, FaRedo, FaCheck } from "react-icons/fa";

function ScoreBoard({ time, moves, matchedCount, totalPairs, onReset, isGameComplete }) {
  return (
    <div className="text-center mb-3 sm:mb-4 md:mb-6 w-full">

      {/* Stats row */}
      <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">

        {/* Timer */}
        <div
          className="px-2 sm:px-3 md:px-4 py-2 rounded-xl flex-1 max-w-[80px] sm:max-w-[90px] md:max-w-[110px]"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="text-[9px] sm:text-[10px] md:text-xs text-sky-300 flex items-center justify-center gap-1 font-semibold tracking-widest uppercase">
            <FaClock /> WAKTU
          </p>
          <p className="text-base sm:text-lg md:text-2xl font-bold text-white tabular-nums">{time}</p>
        </div>

        {/* Moves */}
        <div
          className="px-2 sm:px-3 md:px-4 py-2 rounded-xl flex-1 max-w-[80px] sm:max-w-[90px] md:max-w-[110px]"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="text-[9px] sm:text-[10px] md:text-xs text-violet-300 flex items-center justify-center gap-1 font-semibold tracking-widest uppercase">
            <FaMousePointer /> COBA
          </p>
          <p className="text-base sm:text-lg md:text-2xl font-bold text-white tabular-nums">{moves}</p>
        </div>

        {/* Found */}
        <div
          className="px-2 sm:px-3 md:px-4 py-2 rounded-xl flex-1 max-w-[80px] sm:max-w-[90px] md:max-w-[110px]"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="text-[9px] sm:text-[10px] md:text-xs text-green-300 flex items-center justify-center gap-1 font-semibold tracking-widest uppercase">
            <FaCheck /> DAPAT
          </p>
          <p className="text-base sm:text-lg md:text-2xl font-bold text-white tabular-nums">
            {matchedCount}/{totalPairs}
          </p>
        </div>

      </div>

      {/* Win message */}
      {isGameComplete && (
        <p
          className="animate-win font-bold text-xs sm:text-sm md:text-lg mb-2 sm:mb-3 px-2"
          style={{
            background: 'linear-gradient(90deg, #fbbf24, #f0abfc, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🎉 Selamat! Menang dalam {moves} percobaan & dalam waktu {time}!
        </p>
      )}

      {/* Reset button */}
      <button
        onClick={onReset}
        className="btn-levitate px-4 sm:px-5 md:px-7 py-1.5 sm:py-2 md:py-2.5 font-bold rounded-full flex items-center gap-2 mx-auto text-indigo-900 text-xs sm:text-sm md:text-base"
        style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: '0 4px 15px rgba(251,191,36,0.4)',
        }}
      >
        {isGameComplete ? <FaRedo /> : <FaSyncAlt />}
        {isGameComplete ? 'Main Lagi' : 'Acak Ulang'}
      </button>

    </div>
  );
}

export default ScoreBoard;