import React from "react";
import { FaClock, FaMousePointer, FaSyncAlt, FaRedo, FaCheck } from "react-icons/fa";

function ScoreBoard({ time, moves, matchedCount, totalPairs, onReset, isGameComplete }) {
  return (
    <div className="text-center mb-6">
      <div className="flex justify-center gap-4 mb-4">
        <div className="px-4 py-2 rounded-xl min-w-[80px]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-xs text-sky-300 flex items-center justify-center gap-1 font-semibold tracking-widest uppercase">
            <FaClock /> WAKTU
          </p>
          <p className="text-2xl font-bold text-white tabular-nums">{time}</p>
        </div>

        <div className="px-4 py-2 rounded-xl min-w-[80px]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-xs text-violet-300 flex items-center justify-center gap-1 font-semibold tracking-widest uppercase">
            <FaMousePointer /> PERCOBAAN
          </p>
          <p className="text-2xl font-bold text-white tabular-nums">{moves}</p>
        </div>

        <div className="px-4 py-2 rounded-xl min-w-[80px]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-xs text-green-300 flex items-center justify-center gap-1 font-semibold tracking-widest uppercase">
            <FaCheck /> DITEMUKAN
          </p>
          <p className="text-2xl font-bold text-white tabular-nums">{matchedCount}/{totalPairs}</p>
        </div>
      </div>

      {isGameComplete && (
        <p className="animate-win font-bold text-lg mb-3"
          style={{ background: 'linear-gradient(90deg,#fbbf24,#f0abfc,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          🎉 Selamat! Menang dalam {moves} percobaan & {time}!
        </p>
      )}

      <button
        onClick={onReset}
        className="btn-levitate px-7 py-2.5 font-bold rounded-full flex items-center gap-2 mx-auto text-indigo-900"
        style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', boxShadow: '0 4px 15px rgba(251,191,36,0.4)' }}
      >
        {isGameComplete ? <FaRedo /> : <FaSyncAlt />}
        {isGameComplete ? 'Main Lagi' : 'Acak Ulang'}
      </button>
    </div>
  );
}

export default ScoreBoard;