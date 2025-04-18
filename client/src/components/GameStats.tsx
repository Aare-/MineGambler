import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import {calculatePotentialWin} from "@/lib/gameUtils.ts";
import {Button} from "@/components/ui/button.tsx";

const GameStats: React.FC = () => {
  const { gameState, formatNumber, startGame, cashOut, resetGame } = useGame();
  const { stats } = gameState;
  const potentialWin = calculatePotentialWin(gameState.wager, gameState.currentMultiplier);

  return (
      <div className="h-full flex flex-col justify-between pe-2 ps-2 pt-1 pb-1 text-center w-48 gap-1">

          <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-1">
                  <p className="text-gray-400 text-xs">WAGER</p>
                  <p className="text-xl font-semibold text-white">{formatNumber(gameState.wager)}</p>
              </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-1">
                  <p className="text-gray-400 text-xs">MULTIPLIER</p>
                  <p className="text-xl font-semibold text-purple-500">{gameState.currentMultiplier.toFixed(2)}×</p>
              </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-1">
                  <p className="text-gray-400 text-sm">POTENTIAL WIN</p>
                  <p className="text-xl font-semibold text-emerald-500">{formatNumber(potentialWin)}</p>
              </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-1">
              <p className="text-gray-400 text-xs">P / W / L</p>
                <div className="grid-cols-3 grid content-evenly grid-rows-1">
                    <p className="text-xl font-semibold">{stats.gamesPlayed}</p>
                    <p className="text-xl font-semibold text-emerald-500">{stats.gamesWon}</p>
                    <p className="text-xl font-semibold text-red-500">{stats.gamesLost}</p>
                </div>
            </CardContent>
          </Card>

          {gameState.gameMode === 'setup' &&
              <Card className="bg-gray-800 border-gray-700">
                  <Button
                      onClick={startGame}
                      disabled={gameState.wager > gameState.balance || gameState.wager < 1}
                      className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-lg shadow-purple-700/20 flex-auto w-full"
                  >
                      Start Game
                  </Button>
              </Card>}

          {gameState.gameMode === 'playing' &&
              <Card className="bg-gray-800 border-gray-700">
                  <Button
                      onClick={cashOut}
                      disabled={!gameState.gameActive || gameState.revealedPositions.length === 0}
                      className={`px-6 py-3 font-bold text-lg transition-all flex-auto w-full ${
                          gameState.gameActive && gameState.revealedPositions.length > 0
                              ? "bg-emerald-500 hover:bg-emerald-600 animate-pulse shadow-lg shadow-emerald-500/20"
                              : "bg-emerald-500/50"
                      }`}
                  >CASH OUT</Button>
              </Card>}

          {gameState.gameMode === 'result' &&
              <Card className="bg-gray-800 border-gray-700">
                  <Button
                      onClick={resetGame}
                      className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-lg shadow-purple-700/20 flex-auto w-full"
                  >Play Again</Button>
              </Card>}
      </div>
  );
};

export default GameStats;
