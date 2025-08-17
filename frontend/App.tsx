
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameStatus, NumberCellData, GameResult } from './types';
import { getInitialState, placeBet as placeBetService, getDrawResult } from './services/gameService';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.LOADING,
    prizePool: 0,
    numbers: [],
    drawTime: new Date(Date.now() + 300000), // 5 minutes from now
    betAmount: 0.001,
  });
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isBetting, setIsBetting] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDraw = useCallback(() => {
    setGameState(prev => ({ ...prev, status: GameStatus.DRAWING }));
    setTimeout(async () => {
      const result = await getDrawResult(gameState.numbers);
      setGameResult(result);
      setGameState(prev => ({ ...prev, status: GameStatus.RESULTS }));
    }, 5000); // Simulate drawing time
  }, [gameState.numbers]);

  useEffect(() => {
    const fetchInitialState = async () => {
      const initialState = await getInitialState();
      setGameState(initialState);
      setSelectedNumber(null);
      setIsBetting(false);
    };
    fetchInitialState();
  }, []);

  const handleSelectNumber = (num: number) => {
    if (gameState.numbers.find(n => n.num === num && n.owner)) {
      showToast('Bu sayı dolu', 'error');
      return;
    }
    setSelectedNumber(num === selectedNumber ? null : num);
  };

  const handlePlaceBet = async () => {
    if (!selectedNumber) return;
    setIsBetting(true);
    try {
      const { success, prizePool, numbers } = await placeBetService(
        selectedNumber,
        gameState.prizePool,
        gameState.betAmount,
        gameState.numbers
      );
      if (success) {
        setGameState(prev => ({ ...prev, prizePool, numbers }));
        showToast('Bahsiniz başarıyla alındı!', 'success');
        setSelectedNumber(null);
      } else {
        throw new Error('Failed to place bet.');
      }
    } catch (error) {
      showToast('İşlem başarısız oldu.', 'error');
    } finally {
      setIsBetting(false);
    }
  };

  const handleJoinNewRound = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.LOADING }));
    setGameResult(null);
    const fetchInitialState = async () => {
      const initialState = await getInitialState();
      setGameState(initialState);
      setSelectedNumber(null);
      setIsBetting(false);
    };
    setTimeout(fetchInitialState, 1000); // Simulate loading new round
  };

  const renderContent = () => {
    switch (gameState.status) {
      case GameStatus.LOADING:
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-base-purple"></div>
          </div>
        );
      case GameStatus.RESULTS:
        return <ResultsScreen result={gameResult} onJoinNewRound={handleJoinNewRound} />;
      case GameStatus.ACTIVE:
      case GameStatus.DRAWING:
      default:
        return (
          <GameScreen
            gameState={gameState}
            selectedNumber={selectedNumber}
            isBetting={isBetting}
            onSelectNumber={handleSelectNumber}
            onPlaceBet={handlePlaceBet}
            onDraw={handleDraw}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-dark font-sans flex flex-col items-center p-4">
      {renderContent()}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;
