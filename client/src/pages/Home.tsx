import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { calculatePotentialWin } from '@/lib/gameUtils';
import GameSetup from '@/components/GameSetup';
import GameBoard from '@/components/GameBoard';
import GameResult from '@/components/GameResult';
import GameStats from '@/components/GameStats';

const Home: React.FC = () => {
  const { gameState } = useGame();

  return (
    <div className="container max-w-4xl mx-auto h-dvh overflow-hidden">
      {/* Main content area - flex grow to take available space */}
      <div className="flex gap-2 overflow-y-visible h-dvh max-h-96">
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 flex-1">
          {/* Show different components based on game stage */}
          {gameState.gameMode === 'setup' && <GameSetup />}
          {gameState.gameMode === 'playing' && <GameBoard />}
          {gameState.gameMode === 'result' && <GameResult />}
        </div>

        <div className="w-48 bg-gray-800 rounded-lg border border-gray-700">
          <GameStats />
        </div>
      </div>
    </div>
  );
};

export default Home;
