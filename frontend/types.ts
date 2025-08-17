
export enum GameStatus {
  LOADING = 'LOADING',
  ACTIVE = 'ACTIVE',
  DRAWING = 'DRAWING',
  RESULTS = 'RESULTS',
}

export interface NumberCellData {
  num: number;
  owner?: string;
}

export interface GameState {
  status: GameStatus;
  prizePool: number;
  numbers: NumberCellData[];
  drawTime: Date;
  betAmount: number;
}

export interface GameResult {
  winningNumber: number;
  winner?: string;
  prize: number;
}
