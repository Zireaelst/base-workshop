
import React from 'react';
import Confetti from './Confetti';
import { GameResult } from '@/lib/types';

interface ResultsScreenProps {
  result: GameResult | null;
  onJoinNewRound: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onJoinNewRound }) => {
  if (!result) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Sonuçlar yükleniyor...</p>
      </div>
    );
  }

  const { winningNumber, winner, prize } = result;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center h-screen animate-fadeIn">
      {winner && <Confetti />}
      <div className="bg-base-gray p-8 rounded-2xl shadow-2xl w-full">
        <h2 className="text-3xl font-bold text-white mb-2">Çekiliş Sonuçlandı!</h2>
        <p className="text-gray-400 mb-6">Kazanan numara</p>
        <div className="bg-base-dark w-32 h-32 rounded-full mx-auto flex items-center justify-center text-5xl font-bold text-base-purple mb-6 ring-4 ring-base-purple">
          {winningNumber}
        </div>
        
        {winner ? (
          <>
            <h3 className="text-xl text-green-400 font-semibold">Tebrikler, {winner}!</h3>
            <p className="text-lg text-gray-300 mt-2">Kazanılan Ödül</p>
            <p className="text-3xl font-bold text-green-400">{prize.toFixed(4)} ETH</p>
          </>
        ) : (
          <>
            <h3 className="text-xl text-red-400 font-semibold">Bu sayıyı kimse seçmedi.</h3>
            <p className="text-lg text-gray-300 mt-2">Ödül Kasaya Devretti!</p>
          </>
        )}

        <button
          onClick={onJoinNewRound}
          className="w-full mt-8 text-lg font-bold text-white bg-base-purple rounded-lg px-6 py-4 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Yeni Tura Katıl
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
