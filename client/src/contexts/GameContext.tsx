import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, gameConfig, GameStats } from '@shared/schema';
import { generateMinePositions, calculateMultiplier } from '@/lib/gameUtils';
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
  stats: defaultStats,
  gameMode: 'setup'
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { toast } = useToast();

  useEffect(() => {
    setGameState(prev => ({ ...prev, balance: window.initialBalance ?? 404 }));
  }, []);

  // Monitor game state to determine which stage to show
  useEffect(() => {
    if (!gameState.gameActive && gameState.revealedPositions.length === 0) {
      setGameState(prev => ({ ...prev, gameMode: 'setup' }));
    } else if (gameState.gameActive) {
      setGameState(prev => ({ ...prev, gameMode: 'playing' }));
    } else if (!gameState.gameActive && gameState.revealedPositions.length > 0) {
      setGameState(prev => ({ ...prev, gameMode: 'result' }));
    }
  }, [gameState.gameActive, gameState.revealedPositions.length]);

  useEffect(() => {
      window.ReactNativeWebView?.postMessage(JSON.stringify(gameState.balance));
  }, [gameState.balance]);

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
