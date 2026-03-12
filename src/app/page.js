'use client';

import React, { useState, useEffect, useRef } from "react";
import GameBoard from "@/components/GameBoard";
import ScoreBoard from "@/components/ScoreBoard";
import SnowCanvas from "@/components/Snowcanvas";

import { GiCardJoker } from 'react-icons/gi';
import { FaAppleAlt, FaLemon, FaHeart, FaStar, FaWater, FaBolt, FaSnowflake, FaCloud } from "react-icons/fa";

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
  const [difficulty, setDifficulty] = useState('Easy');
  const [cards, setCards] = useState(() => createCards(4));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [wrongCards, setWrongCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    const totalPairs = DIFFICULTY[difficulty].pairs;
    if (matchedCards.length / 2 === totalPairs && totalPairs > 0) {
      setIsRunning(false);
    }
  }, [matchedCards, difficulty]);

  const cardsRef = useRef(cards);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
  if (flippedCards.length === 2) {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(c => c.id === firstId);
    const secondCard = cards.find(c => c.id === secondId);

    if (!firstCard || !secondCard) return; 

    setMoves(prev => prev + 1);

    if (firstCard.pairId === secondCard.pairId) {
      setWrongCards([]); 
      setMatchedCards(prev => [...prev, firstId, secondId]);
      setFlippedCards([]);
    } else {
      setWrongCards([firstId, secondId]);
      const t = setTimeout(() => {
        setFlippedCards([]);
        setWrongCards([]);
      }, 900);
      return () => clearTimeout(t);
    }
  }
}, [flippedCards]);

  const handleCardFlip = (id) => {
    if (!isRunning) setIsRunning(true);
    if (flippedCards.length < 2 && !flippedCards.includes(id) && !matchedCards.includes(id)) {
      setFlippedCards(prev => [...prev, id]);
    }
  };

  const resetGame = (level = difficulty) => {
    clearInterval(timerRef.current);
    setCards(createCards(DIFFICULTY[level].pairs));
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

  const totalPairs = DIFFICULTY[difficulty].pairs;
  const isGameComplete = matchedCards.length / 2 === totalPairs;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0a2e 0%, #0d1b4b 30%, #1a0a3e 60%, #0a1a2e 100%)' }}
    >
      <SnowCanvas />

      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-5 flex items-center gap-3">
          <GiCardJoker className="text-yellow-300 text-4xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.6))' }} />
          <span className="title-gradient cursor-default">Memory Card</span>
        </h1>

        <div className="flex gap-3 mb-5">
          {Object.keys(DIFFICULTY).map((level) => (
            <button
              key={level}
              onClick={() => handleDifficulty(level)}
              className={`btn-diff px-5 py-1.5 rounded-full font-semibold text-sm border
                ${difficulty === level
                  ? 'active bg-yellow-400 text-indigo-900 border-yellow-300'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
            >
              {level} ({DIFFICULTY[level].pairs})
            </button>
          ))}
        </div>

        <ScoreBoard
          time={formatTime(time)}
          moves={moves}
          matchedCount={matchedCards.length / 2}
          totalPairs={totalPairs}
          onReset={() => resetGame()}
          isGameComplete={isGameComplete}
        />

        <div className="p-6 rounded-2xl shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}
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