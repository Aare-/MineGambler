import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const GameBoard: React.FC = () => {
  const { gameState, revealTile, cashOut } = useGame();
  
  // Generate tile class based on state
  const getTileClass = (position: number) => {
    let baseClass = "tile aspect-square flex items-center justify-center rounded-lg shadow transition-all";
    
    // Tile not yet clicked
    if (!gameState.revealedPositions.includes(position)) {
      return `${baseClass} bg-slate-100 hover:bg-slate-200 text-gray-800 cursor-pointer`;
    }
    
    // Tile is revealed
    const isMine = gameState.minePositions.includes(position);
    if (isMine) {
      return `${baseClass} revealed animate-explode bg-red-500 text-white`;
    } else {
      return `${baseClass} revealed animate-reveal bg-emerald-500 text-white`;
    }
  };
  
  // Render tile content based on state
  const renderTileContent = (position: number) => {
    if (!gameState.revealedPositions.includes(position)) {
      return null;
    }
    
    if (gameState.minePositions.includes(position)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else {
      // For safe tiles, we'll show the increment to the multiplier
      const revealIndex = gameState.revealedPositions.indexOf(position);
      const prevCount = revealIndex > 0 ? revealIndex : 0;
      
      // We need to calculate what this specific tile added to the multiplier
      const tileMultiplier = "+0.00×"; // Default
      
      return <span className="font-bold">{tileMultiplier}</span>;
    }
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-md mx-auto">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={getTileClass(index)}
            onClick={() => revealTile(index)}
          >
            {renderTileContent(index)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button
          onClick={cashOut}
          disabled={!gameState.gameActive || gameState.revealedPositions.length === 0}
          className={`px-8 py-3 font-bold text-lg transition-all ${
            gameState.gameActive && gameState.revealedPositions.length > 0
              ? "bg-emerald-500 hover:bg-emerald-600 animate-pulse shadow-lg shadow-emerald-500/20"
              : "bg-emerald-500/50"
          }`}
        >
          CASH OUT
        </Button>
      </div>
    </div>
  );
};

export default GameBoard;
