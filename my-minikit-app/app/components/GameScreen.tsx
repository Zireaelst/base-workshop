
import React from 'react';
import { GameState } from '@/lib/types';
import PrizePool from './PrizePool';
import CountdownTimer from './CountdownTimer';
import NumberGrid from './NumberGrid';

interface GameScreenProps {
  gameState: GameState;
  selectedNumber: number | null;
  isBetting: boolean;
  onSelectNumber: (num: number) => void;
  onPlaceBet: () => void;
  onDraw: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  selectedNumber,
  isBetting,
  onSelectNumber,
  onPlaceBet,
  onDraw,
}) => {
  const { prizePool, drawTime, numbers, betAmount, status } = gameState;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 animate-fadeIn">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-white">Base Tombala</h1>
        <p className="text-base-purple-light">Sıradaki çekilişe</p>
        <CountdownTimer targetDate={drawTime} onComplete={onDraw} />
      </header>

      <PrizePool amount={prizePool} />

      <NumberGrid
        numbers={numbers}
        selectedNumber={selectedNumber}
        onSelect={onSelectNumber}
      />

      <div className="w-full mt-4">
        <button
          onClick={onPlaceBet}
          disabled={!selectedNumber || isBetting || status !== 'ACTIVE'}
          className="w-full text-lg font-bold text-white bg-base-purple rounded-lg px-6 py-4 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-base-gray disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
        >
          {isBetting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              İşlem Onaylanıyor...
            </>
          ) : selectedNumber ? (
            `${selectedNumber} Numarasına Bahis Yap (${betAmount} ETH)`
          ) : (
            'Bahis Yapmak İçin Bir Sayı Seçin'
          )}
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
