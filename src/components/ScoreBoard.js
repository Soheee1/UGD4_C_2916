    import React from "react";
    import { FaClock, FaMousePointer, FaSyncAlt, FaRedo, FaCheck } from "react-icons/fa";

    function ScoreBoard ({time, moves, matchedCount, totalPairs, onReset}) {
        const isGameComplete = matchedCount === totalPairs;

        return (
            <div className="text-center mb-6">
                <div className="flex justify-center gap-8 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[80px]">
                        <p className="text-sm text-indigo-200 flex items-center justify-center gap-1">
                            <FaClock className="text-indigo-300"/> WAKTU 
                        </p>
                        <p className="text-2xl font-bold text-white">{time}</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[80px]">
                        <p className="text-sm text-indigo-200 flex items-center justify-center gap-1">
                            <FaMousePointer className="text-indigo-300" />  PERCOBAAN
                        </p>
                        <p className="text-2xl font-bold text-white">{moves}</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg min-w-[80px]">
                        <p className="text-sm text-indigo-200 flex items-center justify-center gap-1">
                            <FaCheck className="text-indigo-300" /> DITEMUKAN
                        </p>
                        <p className="text-2xl font-bold text-white">{matchedCount}/{totalPairs}</p>                    
                    </div>
                </div>

                {isGameComplete  && (
                    <p className="text-yellow-300 font-bold text-lg mb-3 animate-pulse">
                        🎉🎉 Selamat ! Kamu Menang dalam {time} dan dalam waktu {moves}  🎉🎉
                    </p>
                )}

                <button 
                    onClick={onReset}
                    className="px-6 py-2 bg-yellow-400 text-indigo-900 font-bold rounded-full hover:bg-yellow-300 transition-all duration-200 shadow-lg flex items-center gap-2 mx-auto hover:scale-105"
                >
                    {isGameComplete ? <FaRedo /> : <FaSyncAlt />}
                    {isGameComplete ? 'Main Lagi' : 'Acak Ulang'}
                </button>
            </div>
        );
    }

    export default ScoreBoard;
