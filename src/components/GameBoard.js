import React from "react";
import Card from "./Card";

function GameBoard({ cards, flippedCards, matchedCards, wrongCards = [], onFlip, cols = 4 }) {
  return (
    <div
      className="grid gap-2 sm:gap-3 md:gap-4 justify-items-center"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          isFlipped={flippedCards.includes(card.id)}
          isMatched={matchedCards.includes(card.id)}
          isWrong={wrongCards.includes(card.id)}
          onFlip={onFlip}
        />
      ))}
    </div>
  );
}

export default GameBoard;