import React, { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { calculatePotentialWin } from '@/lib/gameUtils';
import GameSetup from '@/components/GameSetup';
import GameBoard from '@/components/GameBoard';
import GameResult from '@/components/GameResult';
import GameStats from '@/components/GameStats';

const Home: React.FC = () => {
  const { gameState, formatNumber } = useGame();
  const [gameStage, setGameStage] = useState<'setup' | 'playing' | 'result'>('setup');
  
  // Calculate potential win based on current multiplier
  const potentialWin = calculatePotentialWin(gameState.wager, gameState.currentMultiplier);
  
  // Monitor game state to determine which stage to show
  useEffect(() => {
    if (!gameState.gameActive && gameState.revealedPositions.length === 0) {
      setGameStage('setup');
    } else if (gameState.gameActive) {
      setGameStage('playing');
    } else if (!gameState.gameActive && gameState.revealedPositions.length > 0) {
      setGameStage('result');
    }
  }, [gameState.gameActive, gameState.revealedPositions.length]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Game Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white flex justify-center items-center gap-2">
          <span className="text-amber-500">Minesweeper</span> Gold
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        </h1>
        <p className="text-gray-300">Uncover safe tiles, avoid mines, win coins!</p>
      </header>

      {/* Balance Display */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            <p className="text-gray-400 text-sm">BALANCE</p>
            <p className="text-2xl font-bold text-amber-500 shine">{formatNumber(gameState.balance)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">WAGER</p>
            <p className="text-xl font-semibold text-white">{formatNumber(gameState.wager)}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <p className="text-gray-400 text-sm">POTENTIAL WIN</p>
            <p className="text-xl font-semibold text-emerald-500">{formatNumber(potentialWin)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">MULTIPLIER</p>
            <p className="text-xl font-semibold text-purple-500">{gameState.currentMultiplier.toFixed(2)}×</p>
          </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl border border-gray-700">
        {/* Show different components based on game stage */}
        {gameStage === 'setup' && <GameSetup />}
        {gameStage === 'playing' && <GameBoard />}
        {gameStage === 'result' && <GameResult />}
      </div>
      
      {/* Game Stats */}
      <GameStats />
    </div>
  );
};

export default Home;
