import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';

const GameStats: React.FC = () => {
  const { gameState, formatNumber } = useGame();
  const { stats } = gameState;
  
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <p className="text-gray-400 text-xs">GAMES PLAYED</p>
          <p className="text-xl font-semibold">{stats.gamesPlayed}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <p className="text-gray-400 text-xs">WINS</p>
          <p className="text-xl font-semibold text-emerald-500">{stats.gamesWon}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <p className="text-gray-400 text-xs">LOSSES</p>
          <p className="text-xl font-semibold text-red-500">{stats.gamesLost}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <p className="text-gray-400 text-xs">BIGGEST WIN</p>
          <p className="text-xl font-semibold text-amber-500">{formatNumber(stats.biggestWin)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStats;
