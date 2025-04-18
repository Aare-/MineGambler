import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const GameSetup: React.FC = () => {
  const { gameState, setWager, setMines, startGame, formatNumber } = useGame();
  const [wagerInput, setWagerInput] = useState<string>(gameState.wager.toString());
  
  const handleWagerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWagerInput(e.target.value);
    let value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setWager(value);
    }
  };
  
  const handleWagerPreset = (value: number) => {
    setWagerInput(value.toString());
    setWager(value);
  };
  
  const handleMinesChange = (values: number[]) => {
    setMines(values[0]);
  };
  
  return (
    <div className="p-6 border-b border-gray-700">
      <div className="mb-6">
        <div className="mr-4">
          <p className="text-gray-400 text-sm">BALANCE</p>
          <p className="text-2xl font-bold text-amber-500 shine">{formatNumber(gameState.balance)}</p>
        </div>

        <label htmlFor="wager-input" className="block mb-2 text-sm font-medium text-gray-300">
          Wager Amount
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            id="wager-input"
            type="number"
            min={1}
            max={gameState.balance}
            value={wagerInput}
            onChange={handleWagerChange}
            className="bg-gray-700 border-gray-600 text-white"
          />
          <Button
            onClick={() => handleWagerPreset(1000)}
            variant="outline"
            className="px-3 py-2 text-xs h-9 bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            1K
          </Button>
          <Button
            onClick={() => handleWagerPreset(5000)}
            variant="outline"
            className="px-3 py-2 text-xs h-9 bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            5K
          </Button>
          <Button
            onClick={() => handleWagerPreset(10000)}
            variant="outline"
            className="px-3 py-2 text-xs h-9 bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            10K
          </Button>
          <Button
            onClick={() => handleWagerPreset(50000)}
            variant="outline"
            className="px-3 py-2 text-xs h-9 bg-gray-700 hover:bg-gray-600 border-gray-600"
          >
            50K
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-medium text-gray-300">Number of Mines</label>
          <span className="text-sm font-medium text-amber-500">{gameState.mines}</span>
        </div>
        <Slider
          defaultValue={[gameState.mines]}
          min={1}
          max={24}
          step={1}
          onValueChange={handleMinesChange}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>1</span>
          <span>8</span>
          <span>16</span>
          <span>24</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">Higher risk, higher reward</p>
          <p className="text-xs text-gray-500">More mines = higher multiplier per safe tile</p>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
