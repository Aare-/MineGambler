import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, gameConfig, GameStats } from '@shared/schema';
import { generateMinePositions, calculateMultiplier } from '@/lib/gameUtils';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GameContextType {
  gameState: GameState;
  setWager: (wager: number) => void;
  setMines: (mines: number) => void;
  startGame: () => void;
  revealTile: (position: number) => void;
  cashOut: () => void;
  resetGame: () => void;
  formatNumber: (num: number) => string;
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  biggestWin: 0
};

const initialGameState: GameState = {
  balance: gameConfig.startingBalance,
  wager: 10000,
  mines: 5,
  minePositions: [],
  revealedPositions: [],
  gameActive: false,
  currentMultiplier: 1.00,
  stats: defaultStats
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const setWager = (wager: number) => {
    let value = wager;
    if (isNaN(value)) value = 0;
    if (value > gameConfig.maxWager) value = gameConfig.maxWager;
    if (value < 0) value = 0;
    
    setGameState(prev => ({ ...prev, wager: value }));
  };

  const setMines = (mines: number) => {
    setGameState(prev => ({ ...prev, mines }));
  };

  const startGame = () => {
    if (gameState.wager > gameState.balance || gameState.wager < gameConfig.minWager) {
      toast({
        title: "Invalid wager",
        description: `Wager must be between ${gameConfig.minWager} and ${formatNumber(gameState.balance)} coins.`,
        variant: "destructive"
      });
      return;
    }

    // Deduct wager from balance
    const newBalance = gameState.balance - gameState.wager;
    
    // Generate mine positions
    const minePositions = generateMinePositions(gameState.mines, gameConfig.gridSize);
    
    setGameState(prev => ({
      ...prev,
      balance: newBalance,
      gameActive: true,
      revealedPositions: [],
      currentMultiplier: 1.00,
      minePositions
    }));
  };

  const revealTile = (position: number) => {
    // Check if game is active and tile isn't already revealed
    if (!gameState.gameActive || gameState.revealedPositions.includes(position)) {
      return;
    }

    const newRevealedPositions = [...gameState.revealedPositions, position];
    
    // Check if mine
    if (gameState.minePositions.includes(position)) {
      // Update stats
      const newStats = {
        ...gameState.stats,
        gamesPlayed: gameState.stats.gamesPlayed + 1,
        gamesLost: gameState.stats.gamesLost + 1
      };
      
      // Game over - hit a mine
      setGameState(prev => ({
        ...prev,
        revealedPositions: newRevealedPositions,
        gameActive: false,
        stats: newStats
      }));
      
      // Save stats to server
      saveStats(newStats);
    } else {
      // Safe tile - calculate new multiplier
      const newMultiplier = calculateMultiplier(
        newRevealedPositions.length,
        gameState.mines,
        gameConfig.gridSize
      );
      
      setGameState(prev => ({
        ...prev,
        revealedPositions: newRevealedPositions,
        currentMultiplier: newMultiplier
      }));
    }
  };

  const cashOut = () => {
    if (!gameState.gameActive || gameState.revealedPositions.length === 0) {
      return;
    }
    
    const winnings = Math.floor(gameState.wager * gameState.currentMultiplier);
    const netWin = winnings - gameState.wager;
    
    // Update stats
    const newStats = {
      ...gameState.stats,
      gamesPlayed: gameState.stats.gamesPlayed + 1,
      gamesWon: gameState.stats.gamesWon + 1,
      biggestWin: netWin > gameState.stats.biggestWin ? netWin : gameState.stats.biggestWin
    };
    
    setGameState(prev => ({
      ...prev,
      balance: prev.balance + winnings,
      gameActive: false,
      stats: newStats
    }));
    
    // Save stats to server
    saveStats(newStats);
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      currentMultiplier: 1.00,
      revealedPositions: [],
      minePositions: [],
      gameActive: false
    }));
  };

  const saveStats = async (stats: GameStats) => {
    try {
      await apiRequest('POST', '/api/stats', { 
        balance: gameState.balance,
        stats 
      });
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  };

  // Load initial stats from server
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setGameState(prev => ({
            ...prev,
            balance: data.balance || gameConfig.startingBalance,
            stats: data.stats || defaultStats
          }));
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <GameContext.Provider value={{ 
      gameState, 
      setWager, 
      setMines, 
      startGame, 
      revealTile, 
      cashOut, 
      resetGame,
      formatNumber 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
