import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").notNull().default(1000000),
  stats: json("stats").$type<GameStats>().default({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    biggestWin: 0
  }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game specific types
export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  biggestWin: number;
}

export interface GameState {
  balance: number;
  wager: number;
  mines: number;
  minePositions: number[];
  revealedPositions: number[];
  gameActive: boolean;
  currentMultiplier: number;
  stats: GameStats;
}

export const gameConfig = {
  gridSize: 5,
  startingBalance: 1000000,
  maxWager: 1000000,
  minWager: 1
};
