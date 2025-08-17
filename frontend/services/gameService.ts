
import { GameState, GameStatus, NumberCellData, GameResult } from '../types';

const MOCK_USERS = ['@vitalik.eth', '@dwr.eth', '@greg.eth', '@v.eth', '@dev.eth'];
const TOTAL_NUMBERS = 25;

const generateInitialNumbers = (): NumberCellData[] => {
  const numbers: NumberCellData[] = [];
  for (let i = 1; i <= TOTAL_NUMBERS; i++) {
    numbers.push({ num: i });
  }

  // Randomly assign some owners
  const takenCount = Math.floor(Math.random() * 8) + 5; // 5 to 12 taken spots
  for (let i = 0; i < takenCount; i++) {
    const randomIndex = Math.floor(Math.random() * TOTAL_NUMBERS);
    if (!numbers[randomIndex].owner) {
      numbers[randomIndex].owner = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
    }
  }

  return numbers;
};

export const getInitialState = (): Promise<GameState> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: GameStatus.ACTIVE,
        prizePool: parseFloat((Math.random() * 2 + 1).toFixed(4)),
        numbers: generateInitialNumbers(),
        drawTime: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes from now
        betAmount: 0.001,
      });
    }, 1500);
  });
};

export const placeBet = (
  num: number,
  currentPool: number,
  betAmount: number,
  currentNumbers: NumberCellData[]
): Promise<{ success: boolean; prizePool: number; numbers: NumberCellData[] }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        const newNumbers = currentNumbers.map(n => 
          n.num === num ? { ...n, owner: '@me.eth' } : n
        );
        resolve({
          success: true,
          prizePool: currentPool + betAmount,
          numbers: newNumbers,
        });
      } else {
        reject({ success: false });
      }
    }, 1000);
  });
};

export const getDrawResult = (numbers: NumberCellData[]): Promise<GameResult> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const winningNumber = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
            const winnerData = numbers.find(n => n.num === winningNumber)?.owner;
            const prizePool = numbers.filter(n => n.owner).length * 0.001;

            if (winnerData) {
                resolve({
                    winningNumber,
                    winner: winnerData,
                    prize: prizePool
                });
            } else {
                resolve({
                    winningNumber,
                    prize: prizePool
                });
            }
        }, 2000);
    });
};
