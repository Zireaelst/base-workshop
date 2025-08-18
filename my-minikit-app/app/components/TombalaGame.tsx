import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import toast, { Toaster } from 'react-hot-toast';
import {
  useTombalaGameStats,
  useTombalaFilledNumbers,
  useTombalaPlayerBetStatus,
  useTombalaPlayerNumbers,
  useTombalaPlaceBet,
  useTombalaTransactionReceipt,
  useTombalaConstants
} from '@/lib/tombala-hooks';
import { formatEther } from 'viem';

interface TombalaGameProps {
  onBack: () => void;
}

export function TombalaGame({ onBack }: TombalaGameProps) {
  const { address, isConnected } = useAccount();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Contract hooks
  const { data: gameStats, isLoading: gameStatsLoading } = useTombalaGameStats();
  const { data: filledNumbers = [], isLoading: filledNumbersLoading } = useTombalaFilledNumbers();
  const { data: hasPlayerBet } = useTombalaPlayerBetStatus(address);
  const { data: playerNumbers = [] } = useTombalaPlayerNumbers(address);
  const { placeBet, isPending: isBettingPending, error: bettingError, hash } = useTombalaPlaceBet();
  const { data: txReceipt, isLoading: isTxLoading } = useTombalaTransactionReceipt(hash);
  const { betPrice } = useTombalaConstants();

  // Generate numbers 1-25
  const numbers = Array.from({ length: 25 }, (_, i) => i + 1);

  // Convert bigint arrays to number arrays for easier manipulation
  const filledNumbersArray = Array.isArray(filledNumbers) ? filledNumbers as bigint[] : [];
  const playerNumbersArray = Array.isArray(playerNumbers) ? playerNumbers as bigint[] : [];
  const filledNumbersSet = new Set(filledNumbersArray.map(n => Number(n)));
  const playerNumbersSet = new Set(playerNumbersArray.map(n => Number(n)));

  // Format remaining time
  const formatTime = (seconds: bigint | undefined) => {
    if (!seconds) return '00:00:00';
    const totalSeconds = Number(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle bet placement
  const handlePlaceBet = (number: number) => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (filledNumbersSet.has(number)) {
      toast.error('This number is already taken!');
      return;
    }

    if (hasPlayerBet) {
      toast.error('You have already placed a bet in this game!');
      return;
    }

    if (!gameStats?.[1]) { // isActive
      toast.error('Game is not active!');
      return;
    }

    setSelectedNumber(number);
    placeBet(number);
  };

  // Handle transaction status
  useEffect(() => {
    if (txReceipt) {
      toast.success(`Bet successful! Your number: ${selectedNumber}`);
      setSelectedNumber(null);
    }
  }, [txReceipt, selectedNumber]);

  useEffect(() => {
    if (bettingError) {
      toast.error('Bet failed');
      setSelectedNumber(null);
    }
  }, [bettingError]);

  const getNumberStatus = (number: number) => {
    if (playerNumbersSet.has(number)) return 'player';
    if (filledNumbersSet.has(number)) return 'filled';
    return 'available';
  };

  const getNumberClass = (number: number) => {
    const status = getNumberStatus(number);
    const baseClass = 'w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all cursor-pointer hover:scale-105';
    
    switch (status) {
      case 'player':
        return `${baseClass} bg-blue-500 border-blue-600 text-white shadow-lg`;
      case 'filled':
        return `${baseClass} bg-red-500 border-red-600 text-white cursor-not-allowed opacity-75`;
      case 'available':
        return `${baseClass} bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50`;
      default:
        return baseClass;
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tombala Game</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to join the game</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Tombala</h1>
          <div></div>
        </div>

        {/* Game Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Game ID:</span>
              <span className="font-bold ml-2">#{gameStats?.[0]?.toString() || '...'}</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`font-bold ml-2 ${gameStats?.[1] ? 'text-green-600' : 'text-red-600'}`}>
                {gameStatsLoading ? '...' : (gameStats?.[1] ? 'Active' : 'Ended')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Prize Pool:</span>
              <span className="font-bold ml-2">
                {gameStats?.[2] ? `${formatEther(gameStats[2])} ETH` : '...'}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Bets:</span>
              <span className="font-bold ml-2">{gameStats?.[3]?.toString() || '...'}</span>
            </div>
          </div>
          
          {gameStats?.[1] && ( // if game is active
            <div className="mt-4 pt-4 border-t">
              <span className="text-gray-500">Time Remaining:</span>
              <span className="font-bold ml-2 text-lg">
                {formatTime(gameStats[4])}
              </span>
            </div>
          )}
        </div>

        {/* Bet Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Bet Amount:</strong> {betPrice ? formatEther(betPrice) : '0.001'} ETH
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Each player can only select one number
          </p>
        </div>

        {/* Player Status */}
        {hasPlayerBet && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Your Selected Number:</strong> {playerNumbersArray?.[0]?.toString()}
            </p>
          </div>
        )}

        {/* Numbers Grid */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-center">Numbers (1-25)</h3>
          <div className="grid grid-cols-5 gap-3">
            {numbers.map((number) => (
              <button
                key={number}
                className={getNumberClass(number)}
                onClick={() => handlePlaceBet(number)}
                disabled={
                  getNumberStatus(number) !== 'available' || 
                  isBettingPending || 
                  isTxLoading ||
                  hasPlayerBet ||
                  !gameStats?.[1]
                }
              >
                {isBettingPending && selectedNumber === number ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  number
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white border border-gray-300 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Yours</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Taken</span>
            </div>
          </div>
        </div>

        {/* Loading States */}
        {(gameStatsLoading || filledNumbersLoading) && (
          <div className="text-center py-4">
            <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 mt-2">Loading game data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
