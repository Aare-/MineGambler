import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { calculateNetWin } from '@/lib/gameUtils';

const GameResult: React.FC = () => {
  const { gameState, resetGame, formatNumber } = useGame();
  
  const isWin = gameState.revealedPositions.length > 0 && 
                !gameState.revealedPositions.some(pos => gameState.minePositions.includes(pos));
  
  const netWin = isWin ? calculateNetWin(gameState.wager, gameState.currentMultiplier) : -gameState.wager;
  
  // Generate tile class based on state for result grid
  const getTileClass = (position: number) => {
    let baseClass = "aspect-square rounded-lg flex items-center justify-center";
    
    if (gameState.minePositions.includes(position)) {
      // Mine tile
      return `${baseClass} bg-red-500 text-white`;
    } else if (gameState.revealedPositions.includes(position)) {
      // Revealed safe tile
      return `${baseClass} bg-emerald-500 text-white`;
    } else {
      // Unrevealed safe tile
      return `${baseClass} bg-gray-600 text-gray-300`;
    }
  };
  
  // Render tile content for result grid
  const renderTileContent = (position: number) => {
    if (gameState.minePositions.includes(position)) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else {
      return <span className="text-xs">SAFE</span>;
    }
  };
  
  return (
    <div className="relative">
      <div className="grid grid-cols-5 gap-2 max-w-72 mx-auto p-0">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={getTileClass(index)}
          >
            {renderTileContent(index)}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${isWin ? 'text-emerald-500' : 'text-red-500'}`}>
            {isWin ? 'You Won!' : 'You Lost!'}
          </h2>
          <p className="text-gray-300">
            {isWin
                ? `You found ${gameState.revealedPositions.length} safe tiles and won`
                : 'You hit a mine and lost your wager'}
          </p>
          <p className={`text-3xl font-bold mt-2 ${isWin ? 'text-amber-500' : 'text-red-500'}`}>
            {netWin > 0 ? '+' : ''}{formatNumber(netWin)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
