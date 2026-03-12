'use client';

import React, { useState, useEffect, useRef } from "react";
import GameBoard from "@/components/GameBoard";
import ScoreBoard from "@/components/ScoreBoard";

import { GiCardJoker } from 'react-icons/gi';
import { FaAppleAlt, FaLemon, FaHeart, FaStar, FaWater, FaBolt, FaSnowflake, FaCloud } from "react-icons/fa";

const ICONS = [
  { icon: FaAppleAlt, color: '#ef4444' },
  { icon: FaLemon, color: '#eab308' },
  { icon: FaHeart, color: '#ec4899' },
  { icon: FaStar, color: '#f97316' },
  { icon: FaWater, color: '#2b65ec' },
  { icon: FaBolt, color: '#facc15' },
  { icon: FaSnowflake, color: '#38bdf8' },
  { icon: FaCloud, color: '#a5b4fc' },
];

const DIFFICULTY = {
  Easy: { pairs: 4 },
  Medium: { pairs: 6 },
  Hard: { pairs: 8 },
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
    { id: index * 2, icon: item.icon, color: item.color, pairId: index },
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

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      setMoves(prev => prev + 1);

      if (firstCard.pairId === secondCard.pairId) {
        setMatchedCards(prev => [...prev, firstId, secondId]);
        setFlippedCards([]);
      } else {
        const t = setTimeout(() => setFlippedCards([]), 800);
        return () => clearTimeout(t);
      }
    }
  }, [flippedCards, cards]);

  const handleCardFlip = (id) => {
    if (!isRunning) setIsRunning(true);
    if (flippedCards.length < 2 && !flippedCards.includes(id)) {
      setFlippedCards(prev => [...prev, id]);
    }
  };

  const resetGame = (level = difficulty) => {
    clearInterval(timerRef.current);
    setCards(createCards(DIFFICULTY[level].pairs));
    setFlippedCards([]);
    setMatchedCards([]);
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

  const gridCols = difficulty === 'Hard' ? 4 : 4;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-lg flex items-center gap-3">
        <GiCardJoker className="text-yellow-300 text-4xl" />
        Memory Card
      </h1>

      <div className="flex gap-2 mb-5">
        {Object.keys(DIFFICULTY).map((level) => (
          <button
            key={level}
            onClick={() => handleDifficulty(level)}
            className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-200
              ${difficulty === level
                ? 'bg-yellow-400 text-indigo-900 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
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

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl">
        <GameBoard
          cards={cards}
          flippedCards={flippedCards}
          matchedCards={matchedCards}
          onFlip={handleCardFlip}
          cols={gridCols}
        />
      </div>
    </div>
  );
}

