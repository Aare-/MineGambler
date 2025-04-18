// Generate random mine positions
import {useEffect, useState} from "react";

export function generateMinePositions(mineCount: number, gridSize: number): number[] {
  const totalTiles = gridSize * gridSize;
  const minePositions: number[] = [];
  
  while (minePositions.length < mineCount) {
    const position = Math.floor(Math.random() * totalTiles);
    if (!minePositions.includes(position)) {
      minePositions.push(position);
    }
  }
  
  return minePositions;
}

// Calculate multiplier based on revealed tiles and mines
export function calculateMultiplier(revealedCount: number, mineCount: number, gridSize: number): number {
  const totalTiles = gridSize * gridSize;
  const safeTiles = totalTiles - mineCount;
  
  // Using a formula that increases multiplier based on mines and revealed tiles
  // More mines = higher multiplier growth
  const baseMultiplier = 1 + (mineCount / 10);
  let multiplier = baseMultiplier ** revealedCount;
  
  // Limit to 2 decimal places
  multiplier = Math.round(multiplier * 100) / 100;
  
  return multiplier;
}

// Calculate potential win amount
export function calculatePotentialWin(wager: number, multiplier: number): number {
  return Math.floor(wager * multiplier);
}

// Calculate net win (winnings - wager)
export function calculateNetWin(wager: number, multiplier: number): number {
  const winnings = calculatePotentialWin(wager, multiplier);
  return winnings - wager;
}
