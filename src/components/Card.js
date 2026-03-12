'use client';

import React, { useState, useEffect } from "react";
import { FaQuestion } from 'react-icons/fa';

function Card({ card, isFlipped, isMatched, isWrong, onFlip }) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    if (!isFlipped && !isMatched && !spinning) {
      setSpinning(true);
      onFlip(card.id);
    }
  };

  useEffect(() => {
    if (spinning) {
      const t = setTimeout(() => setSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [spinning]);

  const isOpen = isFlipped || isMatched;
  const IconComponent = card.icon;

  let innerClass = 'card-inner';
  if (isOpen)    innerClass += ' flipped';
  if (isMatched) innerClass += ' card-matched';
  if (isWrong && !isMatched)   innerClass += ' card-wrong';

  return (
    <div className="card-scene" onClick={handleClick}>
      <div className={innerClass}>
        <div className="card-front">
          <FaQuestion className="text-white/60 text-xl" />
        </div>

        <div className="card-back"
          style={isMatched ? { border: '2px solid #4ade80' } : isWrong ? { border: '2px solid #f87171' } : {}}
        >
          <span className="animate-bounce-once">
            <IconComponent style={{ color: card.color, fontSize: '1.8rem' }} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;