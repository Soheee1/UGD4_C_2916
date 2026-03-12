'use client';

import React from "react";
import { FaQuestion } from 'react-icons/fa';

function Card({ card, isFlipped, isMatched, isWrong, onFlip }) {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onFlip(card.id);
    }
  };

  const isOpen = isFlipped || isMatched;
  const IconComponent = card.icon;

  let innerClass = 'card-inner';
  if (isOpen)                innerClass += ' flipped';
  if (isMatched)             innerClass += ' card-matched';
  if (isWrong && !isMatched) innerClass += ' card-wrong';

  return (
    <div className="card-scene" onClick={handleClick}>
      <div className={innerClass}>

        {/* Front face — hidden side */}
        <div className="card-front">
          <FaQuestion className="text-white/60 text-base sm:text-xl" />
        </div>

        {/* Back face — icon side */}
        <div
          className="card-back"
          style={
            isMatched ? { border: '2px solid #4ade80' } :
            isWrong   ? { border: '2px solid #f87171' } :
            {}
          }
        >
          {isOpen && (
            <span key={`${card.id}-open`} className="animate-bounce-once">
              <IconComponent
                style={{
                  color: card.color,
                  fontSize: 'clamp(1.1rem, 5vw, 1.8rem)',
                }}
              />
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

export default Card;