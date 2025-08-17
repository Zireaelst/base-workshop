"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { GameState, GameStatus, NumberCellData, GameResult } from '@/lib/types';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import Toast from './components/Toast';
import { useTombalaGameStats, useTombalaPlaceBet } from '@/lib/tombala-hooks';

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  
  // Game state management
  const { data: gameStats, refetch: refetchStats } = useTombalaGameStats();
  const { placeBet, isPending: isBetting } = useTombalaPlaceBet();
  
  const [gameState, setGameState] = useState<GameState>({
    status: GameStatus.LOADING,
    prizePool: 0,
    numbers: [],
    drawTime: new Date(Date.now() + 300000), // 5 minutes from now
    betAmount: 0.001,
  });
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Update game state when blockchain data changes
  useEffect(() => {
    if (gameStats) {
      const numbers: NumberCellData[] = [];
      for (let i = 1; i <= 25; i++) {
        numbers.push({
          num: i,
          owner: gameStats[2] && gameStats[2] > 0 ? `Player${i}` : undefined, // Mock data based on prize pool
        });
      }

      setGameState({
        status: gameStats[1] ? GameStatus.ACTIVE : GameStatus.LOADING, // isActive
        prizePool: Number(gameStats[0]) / 1e18, // prizePool from wei
        numbers,
        drawTime: new Date(Number(gameStats[3]) * 1000), // drawTime from unix timestamp
        betAmount: 0.001,
      });
    } else {
      // Set default mock state when no blockchain data
      const numbers: NumberCellData[] = [];
      for (let i = 1; i <= 25; i++) {
        numbers.push({
          num: i,
          owner: Math.random() > 0.7 ? `Player${Math.floor(Math.random() * 10)}` : undefined,
        });
      }
      
      setGameState({
        status: GameStatus.ACTIVE,
        prizePool: 0.025,
        numbers,
        drawTime: new Date(Date.now() + 300000), // 5 minutes from now
        betAmount: 0.001,
      });
    }
  }, [gameStats]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const handleSelectNumber = (num: number) => {
    if (gameState.numbers.find(n => n.num === num && n.owner)) {
      showToast('This number is taken', 'error');
      return;
    }
    setSelectedNumber(num === selectedNumber ? null : num);
  };

  const handlePlaceBet = async () => {
    if (!selectedNumber) return;
    
    try {
      await placeBet(selectedNumber);
      showToast('Bet placed successfully!', 'success');
      setSelectedNumber(null);
      // Refetch stats to update UI
      setTimeout(() => refetchStats(), 2000);
    } catch (error: unknown) {
      showToast((error as Error)?.message || 'Transaction failed.', 'error');
    }
  };

  const handleDraw = useCallback(() => {
    setGameState(prev => ({ ...prev, status: GameStatus.DRAWING }));
    // This would be handled by the smart contract in real implementation
    setTimeout(async () => {
      // Mock result for now
      const result: GameResult = {
        winningNumber: Math.floor(Math.random() * 25) + 1,
        winner: undefined,
        prize: gameState.prizePool,
      };
      setGameResult(result);
      setGameState(prev => ({ ...prev, status: GameStatus.RESULTS }));
    }, 5000);
  }, [gameState.prizePool]);

  const handleJoinNewRound = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.LOADING }));
    setGameResult(null);
    setSelectedNumber(null);
    refetchStats();
  };

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {(() => {
            switch (gameState.status) {
              case GameStatus.LOADING:
                return (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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
          })()}
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
