'use client';

import React, { useState, useEffect, useRef } from "react";
import GameBoard from "@/components/GameBoard";
import ScoreBoard from "@/components/ScoreBoard";
import SnowCanvas from "@/components/Snowcanvas";

import { GiCardJoker } from 'react-icons/gi';
import {
  FaAppleAlt, FaLemon, FaHeart, FaStar,
  FaWater, FaBolt, FaSnowflake, FaCloud
} from "react-icons/fa";

const ICONS = [
  { icon: FaAppleAlt,  color: '#ef4444' },
  { icon: FaLemon,     color: '#eab308' },
  { icon: FaHeart,     color: '#ec4899' },
  { icon: FaStar,      color: '#f97316' },
  { icon: FaWater,     color: '#2b65ec' },
  { icon: FaBolt,      color: '#facc15' },
  { icon: FaSnowflake, color: '#38bdf8' },
  { icon: FaCloud,     color: '#a5b4fc' },
];

const DIFFICULTY = {
  Easy:   { pairs: 4 },
  Medium: { pairs: 6 },
  Hard:   { pairs: 8 },
};

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createCards = (pairs) => {
  const selected = ICONS.slice(0, pairs);
  const paired = selected.flatMap((item, index) => [
    { id: index * 2,     icon: item.icon, color: item.color, pairId: index },
    { id: index * 2 + 1, icon: item.icon, color: item.color, pairId: index },
  ]);
  return shuffleArray(paired);
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function Home() {
  const [difficulty, setDifficulty]     = useState('Easy');
  const [cards, setCards]               = useState(() => createCards(4));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [wrongCards, setWrongCards]     = useState([]);
  const [moves, setMoves]               = useState(0);
  const [time, setTime]                 = useState(0);
  const [isRunning, setIsRunning]       = useState(false);

  // Refs — always up-to-date, never stale inside handlers
  const isCheckingRef = useRef(false);
  const timerRef      = useRef(null);
  const cardsRef      = useRef(cards);
  const flippedRef    = useRef([]);
  const matchedRef    = useRef([]);

  // Keep refs in sync with state
  useEffect(() => { cardsRef.current  = cards;        }, [cards]);
  useEffect(() => { flippedRef.current = flippedCards; }, [flippedCards]);
  useEffect(() => { matchedRef.current = matchedCards; }, [matchedCards]);

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Win detection
  useEffect(() => {
    const totalPairs = DIFFICULTY[difficulty].pairs;
    if (matchedCards.length / 2 === totalPairs && totalPairs > 0) {
      setIsRunning(false);
    }
  }, [matchedCards, difficulty]);

  const handleCardFlip = (id) => {
    if (isCheckingRef.current)          return;
    if (flippedRef.current.includes(id)) return;
    if (matchedRef.current.includes(id)) return;

    if (!isRunning) setIsRunning(true);

    const newFlipped = [...flippedRef.current, id];
    flippedRef.current = newFlipped;
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      isCheckingRef.current = true;

      const [firstId, secondId] = newFlipped;
      const firstCard  = cardsRef.current.find(c => c.id === firstId);
      const secondCard = cardsRef.current.find(c => c.id === secondId);

      if (!firstCard || !secondCard) {
        isCheckingRef.current = false;
        return;
      }

      setMoves(prev => prev + 1);

      if (firstCard.pairId === secondCard.pairId) {
        // ✅ CORRECT MATCH
        const newMatched = [...matchedRef.current, firstId, secondId];
        matchedRef.current = newMatched;
        setMatchedCards(newMatched);
        setWrongCards([]);
        flippedRef.current = [];
        setFlippedCards([]);
        isCheckingRef.current = false;
      } else {
        // ❌ WRONG MATCH
        setWrongCards([firstId, secondId]);
        setTimeout(() => {
          flippedRef.current = [];
          setFlippedCards([]);
          setWrongCards([]);
          isCheckingRef.current = false;
        }, 900);
      }
    }
  };

  const resetGame = (level = difficulty) => {
    clearInterval(timerRef.current);
    isCheckingRef.current = false;
    const newCards = createCards(DIFFICULTY[level].pairs);
    cardsRef.current   = newCards;
    flippedRef.current = [];
    matchedRef.current = [];
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setWrongCards([]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
  };

  const handleDifficulty = (level) => {
    setDifficulty(level);
    resetGame(level);
  };

  const totalPairs     = DIFFICULTY[difficulty].pairs;
  const isGameComplete = matchedCards.length / 2 === totalPairs;

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-8"
      style={{ background: 'linear-gradient(135deg, #0a0a2e 0%, #0d1b4b 30%, #1a0a3e 60%, #0a1a2e 100%)' }}
    >
      <SnowCanvas />

      {/* Ambient glow orbs */}
      <div
        className="fixed top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="fixed bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-lg">

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 flex items-center gap-2 sm:gap-3">
          <GiCardJoker
            className="text-yellow-300 text-2xl sm:text-3xl md:text-4xl drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.6))' }}
          />
          <span className="title-gradient-anim-spin cursor-default">Memory Card</span>
        </h1>

        {/* Difficulty Selector */}
        <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-5">
          {Object.keys(DIFFICULTY).map((level) => (
            <button
              key={level}
              onClick={() => handleDifficulty(level)}
              className={`btn-diff px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm border transition-all
                ${difficulty === level
                  ? 'active bg-yellow-400 text-indigo-900 border-yellow-300'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
            >
              {level} ({DIFFICULTY[level].pairs})
            </button>
          ))}
        </div>

        {/* Scoreboard */}
        <ScoreBoard
          time={formatTime(time)}
          moves={moves}
          matchedCount={matchedCards.length / 2}
          totalPairs={totalPairs}
          onReset={() => resetGame()}
          isGameComplete={isGameComplete}
        />

        {/* Game Board */}
        <div
          className="p-3 sm:p-4 md:p-6 rounded-2xl shadow-2xl w-full"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <GameBoard
            cards={cards}
            flippedCards={flippedCards}
            matchedCards={matchedCards}
            wrongCards={wrongCards}
            onFlip={handleCardFlip}
            cols={4}
          />
        </div>
      </div>
    </div>
  );
}